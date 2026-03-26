from collections import defaultdict, deque
from time import time

from fastapi import HTTPException, Request, status


_request_buckets: dict[str, deque[float]] = defaultdict(deque)


def rate_limit(scope: str, max_requests: int, window_seconds: int):
    async def dependency(request: Request) -> None:
        client_ip = request.client.host if request.client else "unknown"
        key = f"{scope}:{client_ip}"
        now = time()
        window_start = now - window_seconds

        bucket = _request_buckets[key]
        while bucket and bucket[0] < window_start:
            bucket.popleft()

        if len(bucket) >= max_requests:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Too many requests. Please try again later.",
            )

        bucket.append(now)

    return dependency
