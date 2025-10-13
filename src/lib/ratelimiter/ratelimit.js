// Simple in-memory rate limiter for Next.js API routes
const requests = new Map();

const rateLimit = (limit, interval) => {
  return async (req) => {
    // Get client IP
    const ip = req.headers.get('x-forwarded-for') || 
               req.headers.get('x-real-ip') || 
               req.ip || 
               'unknown';

    const now = Date.now();
    
    // Get or create entry for this IP
    if (!requests.has(ip)) {
      requests.set(ip, { count: 0, firstRequest: now });
    }
    
    const data = requests.get(ip);
    
    // Reset count if interval has passed
    if (now - data.firstRequest > interval) {
      data.count = 0;
      data.firstRequest = now;
    }
    
    // Increment count
    data.count += 1;
    
    // Check if over limit
    if (data.count > limit) {
      const retryAfter = Math.ceil((interval - (now - data.firstRequest)) / 1000);
      return {
        allowed: false,
        remaining: 0,
        retryAfter,
        resetTime: data.firstRequest + interval
      };
    }
    
    // Update the data
    requests.set(ip, data);
    
    return {
      allowed: true,
      remaining: limit - data.count,
      retryAfter: null,
      resetTime: data.firstRequest + interval
    };
  };
};

export default rateLimit;