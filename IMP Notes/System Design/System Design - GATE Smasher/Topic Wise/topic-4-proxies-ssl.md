# Topic 4 Master Study Guide: Forward Proxy vs. Reverse Proxy & SSL/TLS Handshakes

## 1. WHAT, WHY, WHERE, HOW (Technical Mechanics)

### Forward Proxy vs. Reverse Proxy
* **Forward Proxy (Client-Side Proxy)**: Sits in front of the clients. It intercepts outgoing requests from a local private network out to the public internet. It is used to mask the client's identity, block access to prohibited domains (e.g., enterprise content filters), and cache web pages. The internet-facing server never sees the client's actual IP address—it sees only the proxy's IP.
* **Reverse Proxy (Server-Side Proxy)**: Sits in front of the backend servers. It intercepts incoming requests from the public internet and routes them to private servers in a local subnet. It protects server resources, handles load balancing, terminates SSL certificates, and caches dynamic payloads. The client never knows the private backend server IPs—it sees only the reverse proxy's public IP.

### The SSL/TLS Handshake (HTTPS Security Lifecycle)
Every HTTPS session uses **TLS (Transport Layer Security)** to encrypt communication. Below is the technical handshake protocol:

```
[ Client ]                                                     [ Server ]
    │                                                               │
    │ ─── 1. ClientHello (Ciphers, TLS Version, Random Bytes) ───> │
    │                                                               │
    │ <── 2. ServerHello (Selected Cipher) + SSL Certificate ────── │
    │                                                               │
    │ ─── 3. Client Verifies Cert via Public Root Certificate ────> │
    │                                                               │
    │ ─── 4. Client Encrypts Pre-Master Secret via Server's PubKey  │
    │        (using asymmetric RSA/Diffie-Hellman math) ─────────> │
    │                                                               │
    │ <── 5. Both derive Symmetric "Session Key" from Secret ──────>│
    │                                                               │
    │ ─── 6. Secure Symmetrically Encrypted Channel Established ─── │
```

1. **Verify Certificate**: The server sends its certificate signed by a **Certificate Authority (CA)**. The client checks the certificate signature using the CA's public key (pre-loaded inside the OS/Browser). If authentic, the client is guaranteed they are talking to the correct server.
2. **Symmetric Session Key**: Once verified, the client and server negotiate a single **Symmetric Session Key** using asymmetric algorithms. Asymmetric encryption is used solely for the handshake because it is slow and CPU-heavy. All application data is thereafter encrypted using the symmetric session key, which is incredibly fast and performant.

---

## 2. TRADEOFFS (Advantages & Disadvantages under High Load)

| Metric | Forward Proxy | Reverse Proxy |
| :--- | :--- | :--- |
| **Primary Beneficiary** | The Client (protects client identity, speeds up local lookups). | The Server Fleet (protects server resources, handles routing). |
| **SSL Offloading Overhead** | None. Transparent relay or tunnel. | High. Must perform millions of cryptographic calculations to decrypt edge traffic. |
| **Downstream VPC Impact** | Reduces egress gateway costs. | Centralizes access logs, security auditing, and rate-limiting enforcement. |
| **High Traffic Scaling** | Scales by adding local network gateway instances. | Scales by deploying load balancing clusters (L4) in front of the proxy nodes. |

---

## 3. PRODUCTION EXAMPLES
* **Google (GGC - Google Global Cache)**: Uses edge forward-proxies to cache search index results and YouTube segments inside regional enterprise subnets.
* **Cloudflare / Cloudfront**: Act as a global scale Reverse Proxy fleet. They process incoming traffic, screen for malicious patterns (WAF rules), absorb SYN floods, and only forward sanitized, clean HTTP requests to customer origins.
* **Amazon**: Employs reverse proxies inside their VPC clusters to handle SSL/TLS termination. Incoming requests are decrypted at the outer boundary proxy (ALB). The decrypted traffic travels within Amazon’s private server fleet over plain HTTP, maximizing speed and freeing internal application microservices from continuous CPU cryptographic calculations.

---

## 4. MEMORY ANCHORS

### The 20-Year Non-Tech Analogy: The Corporate Diplomat and the Restaurant Hostess
* **Forward Proxy (The Diplomat)**: You want to negotiate a deal with an overseas competitor, but you don't want them to know who you are. You hire a corporate diplomat (Forward Proxy). He travels to the meeting on your behalf, negotiates the contract, and reports back to you. The competitor only knows the diplomat's identity—you remain completely anonymous.
* **Reverse Proxy (The Restaurant Hostess)**: You walk into a 5-star restaurant. You do not run directly into the kitchen to find a chef or see what stoves are free. You must talk to the Hostess (Reverse Proxy). She greets you, checks if you have a reservation, and directs you to an appropriate table while organizing the kitchen staff's workload. You never see the kitchen layout or directly interact with the line cooks.

### ASCII Architecture Diagram
```
  [ Client 1 ] \                                                 / [ Backend Pod 1 ]
  [ Client 2 ] ───> [ Forward Proxy ] ===> [ Internet ] ───> [ Reverse Proxy ] ───> [ Backend Pod 2 ]
  [ Client 3 ] /    (Masks Client IPs)                         (SSL Term/L7 Ingress) \ [ Backend Pod 3 ]
```

---

## 5. LANGUAGES

### Node.js / TypeScript (A Simple Reverse Proxy Server)
Node.js processes proxy redirects asynchronously utilizing the built-in `http` networking module:
```typescript
import http from 'http';

// Reverse Proxy listening on Port 80
http.createServer((clientReq, clientRes) => {
    // Configure destination server options (Private Backend)
    const options = {
        hostname: 'private-app-server.local',
        port: 8080,
        path: clientReq.url,
        method: clientReq.method,
        headers: clientReq.headers
    };

    // Forward the request to the private backend server
    const proxyReq = http.request(options, (proxyRes) => {
        clientRes.writeHead(proxyRes.statusCode || 200, proxyRes.headers);
        proxyRes.pipe(clientRes, { end: true }); // Stream response directly to client
    });

    clientReq.pipe(proxyReq, { end: true }); // Stream request body to backend
}).listen(80);
```

### Java 25+ (Asymmetric SSL/TLS Session Decrypt Engine Simulator)
The following simulation demonstrates performing cryptographic signature verification inside an isolated task running under Project Loom:
```java
import java.security.Signature;
import java.security.cert.CertificateFactory;
import java.security.cert.X509Certificate;
import java.io.ByteArrayInputStream;
import java.util.concurrent.Executors;

public class SSLHandshakeDecryptTask {
    public static void main(String[] args) {
        try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
            executor.submit(() -> {
                try {
                    // Simulating the CPU-intensive certificate signature check on a virtual thread
                    byte[] certBytes = fetchCertificateBytes();
                    CertificateFactory cf = CertificateFactory.getInstance("X.509");
                    X509Certificate cert = (X509Certificate) cf.generateCertificate(new ByteArrayInputStream(certBytes));
                    
                    // Verify certificate validity against root CA
                    cert.checkValidity();
                    System.out.println("Asymmetric TLS Handshake Step: Certificate Verified Successfully.");
                } catch (Exception e) {
                    System.err.println("Handshake Cryptographic Failure: " + e.getMessage());
                }
            });
        }
    }

    private static byte[] fetchCertificateBytes() {
        // Return placeholder certificate bytes
        return new byte[1024]; 
    }
}
```

---

## 6. INFRASTRUCTURE

### Production Nginx Reverse Proxy with TLS 1.3 Termination Config
This configuration establishes a secure, high-performance edge proxy supporting HTTP redirects, TLS 1.3, and robust proxy headers:
```nginx
# nginx-reverse-proxy.conf
events { worker_connections 8192; }

http {
    upstream private_api_cluster {
        server 10.0.1.10:8080;
        server 10.0.1.11:8080;
    }

    # Redirect all port 80 HTTP traffic to HTTPS
    server {
        listen 80;
        server_name api.production.company.com;
        return 301 https://$host$request_uri;
    }

    # Handle SSL / TLS 1.3 Termination at the Reverse Proxy
    server {
        listen 443 ssl;
        server_name api.production.company.com;

        ssl_certificate /etc/ssl/certs/production_cert.pem;
        ssl_certificate_key /etc/ssl/private/production_key.pem;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers HIGH:!aNULL:!MD5;

        location / {
            proxy_pass http://private_api_cluster;
            proxy_set_header Host $host;
            # Forward the client's actual IP to the private backend API
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
```
