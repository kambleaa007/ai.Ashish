# Topic 3 Master Study Guide: Content Delivery Networks (CDNs, Edge Caching, & Latency Optimization)

## 1. WHAT, WHY, WHERE, HOW (Technical Mechanics)
A **Content Delivery Network (CDN)** is a globally distributed system of proxy cache servers deployed in data centers called Point of Presence (PoP) locations. CDNs are designed to sit close to the end-user to offload static media and API workloads from central origin data centers.

### The Mechanics of CDN Caching
1. **Request Interception**: When a client requests `https://static.company.com/assets/banner.png`, DNS resolves to the geographically nearest CDN PoP (Edge Location) using Anycast routing or GeoDNS.
2. **Cache Hit**: If the asset is cached on the local Edge server, it is returned in single-digit milliseconds.
3. **Cache Miss**: If the asset is missing, the Edge server sends a request to the upstream Origin server (located in the company's primary AWS region), fetches the asset, saves a copy in its cache, and sends it to the client.

### Cache Control & Headers
* **TTL (Time to Live)**: Defined via HTTP headers (`Cache-Control: max-age=86400`). It commands the CDN how many seconds to trust the cached asset before asking the origin for updates.
* **Conditional Get**: When TTL expires, the Edge server queries the origin using `If-None-Match: "etag_value"`. If the asset hasn't changed, the origin returns `304 Not Modified`, preventing wasteful body downloads.

### Cache Stampede (Thundering Herd Problem)
When a highly popular cached file expires, or a new video segment is released, millions of users might request the file simultaneously. If a cache miss occurs, all those requests pass through the CDN and hit the origin database together, causing server starvation.
* **The Fix**: CDNs use **Request Collapsing (origin shielding)**. Only the first request goes to the origin to fetch the file, while the other 999,999 waiting requests are queued at the edge, waiting to be served from the fresh cache.

---

## 2. TRADEOFFS (Advantages & Disadvantages under High Load)

| Advantages | Disadvantages |
| :--- | :--- |
| **Drastic Latency Reduction**: Moves content from a 200ms round-trip to a 5ms local Edge hit. | **Stale Data Risks**: If a profile photo is updated, users might see old cached versions until the CDN is purged. |
| **Origin Protection**: CDN handles up to 99% of static body reads, allowing origin servers to scale down. | **High Invalidation Cost**: Purging millions of Edge caches globally can be expensive and slow depending on the CDN vendor. |
| **DDoS Resilience**: Absorbs massive, brute-force traffic spikes (Layer 3/4 flooding) at the Edge rather than inside the main datacenter VPC. | **Vendor Lock-in**: Deeply coupling custom routing logic into CDN scripts (e.g., Cloudflare Workers) can restrict cross-cloud flexibility. |

---

## 3. PRODUCTION EXAMPLES
* **Netflix**: Uses its custom global CDN appliance fleet named **Open Connect**. Netflix physically ships custom storage boxes packed with popular media payloads directly inside the server racks of major Internet Service Providers (ISPs) worldwide. When you stream, video traffic never travels over public trans-oceanic transit lines—it is routed directly over a local ethernet port inside your ISP's regional facility.
* **Facebook**: Operates regional CDNs utilizing Edge proxy servers. They split their user feed data: the text framework of your timeline is served dynamically via dynamic APIs, while high-definition images, videos, and icons are piped directly through geographically distributed CDN caches.

---

## 4. MEMORY ANCHORS

### The 20-Year Non-Tech Analogy: The Global Textbook Publisher
Imagine a major university publisher based in London that prints popular engineering textbooks.
* **No CDN**: Whenever an engineering student in Tokyo, Delhi, or Sydney needs a textbook, they must place an order by mail to London, wait for the book to be printed, loaded onto a cargo ship, and sent across the sea. The latency is 3 months.
* **With CDN**: The London publisher sets up small distribution warehouses (Edge PoPs) in Tokyo, Delhi, and Sydney. When a Tokyo student orders, they fetch the book from the Tokyo warehouse immediately, taking 1 day. If the Tokyo warehouse runs out of stock (Cache Miss), the Tokyo manager orders a single bulk shipment from London (Cache Miss Fetch), stocks the Tokyo shelves, and sells books to subsequent Tokyo students immediately.

### ASCII Architecture Diagram
```
                     [ Client in Tokyo ]
                              │
                    (Anycast DNS resolves)
                              v
                    [ Tokyo CDN PoP Edge ] (Cache Hit? -> Return instantly)
                              │
                         (Cache Miss)
                              v
                     [ London Web Origin ] (Primary AWS Region)
```

---

## 5. LANGUAGES

### Node.js / TypeScript (Dynamic Edge Cache Invalidation Webhook Handler)
When backends update content, they must immediately trigger invalidation webhooks to purge the corresponding CDN Edge caches:
```typescript
import axios from 'axios';

// Backend updates database, then triggers this function to clear the CDN Cache
async function updateProductInDbAndPurgeCdn(productId: string, updatedData: any) {
    // 1. Update Database
    await db.updateProduct(productId, updatedData);

    // 2. Call CDN Purge API (Example: Cloudflare Cache Purge)
    try {
        await axios.post(
            'https://api.cloudflare.com/client/v4/zones/ZONE_ID/purge_cache',
            { files: [`https://static.company.com/products/${productId}.json`] },
            { headers: { 'Authorization': 'Bearer CDN_TOKEN', 'Content-Type': 'application/json' } }
        );
        console.log("CDN Cache Invalidation Sent Successfully.");
    } catch (err) {
        console.error("CDN Cache Purge Failed:", err);
    }
}
```

### Java 25+ (Origin Shield Cache Mock Server with Project Loom Virtual Threads)
When building a custom origin shield proxy in Java, handling hundreds of concurrent incoming requests can be managed safely using blocking HTTP requests executed on Project Loom thread executors.
```java
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;

public class OriginShieldProxy {
    // Thread-safe cache storing key -> asset string representation
    private static final ConcurrentHashMap<String, String> cache = new ConcurrentHashMap<>();
    private static final HttpClient client = HttpClient.newBuilder()
        .executor(Executors.newVirtualThreadPerTaskExecutor()) // Loom Virtual Threading
        .build();

    public String fetchAsset(String key) {
        // Cache read is O(1) in-memory
        return cache.computeIfAbsent(key, this::fetchFromCentralOrigin);
    }

    private String fetchFromCentralOrigin(String key) {
        try {
            HttpRequest request = HttpRequest.newBuilder()
                .uri(new URI("http://central-aws-origin.internal/assets/" + key))
                .GET()
                .build();
            
            // Blocking network request is cheap on virtual threads
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            return response.body();
        } catch (Exception e) {
            return "Fallback-Asset-Placeholder";
        }
    }
}
```

---

## 6. INFRASTRUCTURE

### Cloud-Native AWS CDN Setup (CloudFront + S3 Origin)
This infrastructure map details an S3 bucket configured for static web hosting, locked down so it is only readable via CloudFront utilizing an Origin Access Control (OAC) policy:
```yaml
# S3 Static Bucket & CloudFront Ingest Config
Resources:
  StaticAssetBucket:
    Type: AWS::S3::Bucket
    Properties:
      BucketName: company-production-static-assets-s3
      PublicAccessBlockConfiguration:
        BlockPublicAcls: true
        BlockPublicPolicy: true
        IgnorePublicAcls: true
        RestrictPublicBuckets: true

  CloudFrontOriginAccessControl:
    Type: AWS::CloudFront::OriginAccessControl
    Properties:
      OriginAccessControlConfig:
        Description: "Access Control for Static Asset Bucket"
        Name: "static-oac"
        OriginAccessControlOriginType: s3
        SigningBehavior: always
        SigningProtocol: sigv4

  CDNCloudFrontDistribution:
    Type: AWS::CloudFront::Distribution
    Properties:
      DistributionConfig:
        Enabled: true
        Origins:
          - Id: S3StaticOrigin
            DomainName: company-production-static-assets-s3.s3.amazonaws.com
            OriginAccessControlId: !Ref CloudFrontOriginAccessControl
        DefaultCacheBehavior:
          TargetOriginId: S3StaticOrigin
          ViewerProtocolPolicy: redirect-to-https
          AllowedMethods:
            - GET
            - HEAD
            - OPTIONS
          CachePolicyId: 658327ea-f89d-4fab-a63d-7e88639e58f6 # AWS Managed CacheOptimized Policy
```
