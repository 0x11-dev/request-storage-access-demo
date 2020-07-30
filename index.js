const Koa = require("koa");
const app = new Koa();

app.proxy = true;
var idx  = 0;
app.use((ctx, next)=>{
    ctx.req.headers['x-forwarded-proto'] = 'https';
    next()
})

app.use((ctx, next)=>{
    ctx.cookies.set('_samesite_flag_', true, {
        expires: new Date('2999/12/31 23:59:59'),
        secure: true,
        sameSite: "none"
    })
    next();
})

app.use(ctx => {
    if(!!ctx.cookies.get('_samesite_flag_')){
        ctx.body = '3rd party cookie works!'
    } else {

  ctx.body = `<html><body>
<button  onclick="makeRequestWithUserGesture()" >Request Storage Access</button>
<p>we need storage access</p>
<script>
function makeRequestWithUserGesture() {
  var promise = document.requestStorageAccess();
  promise.then(
    function () {
      // Storage access was granted.
      location.href="/?"+Math.random()
    },
    function () {
      // Storage access was denied.
      alert('Storage access was denied.')
    }
  );
}
</script></body></html>`;
    }

  ctx.cookies.set("demo", ++idx, {
    secure: true,
    httpOnly: true
    // sameSite: "none"
  });
  ctx.status = 200;
});

app.listen(8080);
