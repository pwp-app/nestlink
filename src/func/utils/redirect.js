export const redirectToNotFound = (ctx) => {
  ctx.status = 302;
  ctx.redirect('/?notFound=1');
};
