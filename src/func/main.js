addEventListener('request', async (event) => {
  event.respondWith(await handleRequest(event.context));
});

async function handleRequest(ctx) {}
