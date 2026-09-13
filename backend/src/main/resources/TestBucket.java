import io.github.bucket4j.redis.lettuce.cas.LettuceBasedProxyManager;
import io.lettuce.core.RedisClient;
import io.github.bucket4j.distributed.proxy.ProxyManager;
public class TestBucket {
    public void test() {
        RedisClient redisClient = RedisClient.create("redis://localhost");
        ProxyManager<byte[]> proxyManager = LettuceBasedProxyManager.builderFor(redisClient)
            .withExpirationStrategy(io.github.bucket4j.distributed.ExpirationAfterWriteStrategy.basedOnTimeForRefillingBucketUpToMax(java.time.Duration.ofSeconds(10)))
            .build();
    }
}
