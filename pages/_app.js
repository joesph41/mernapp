import axios from "axios";
import { parseCookies, destroyCookie } from "nookies";
import baseUrl from "../utils/baseUrl";
import { redirectUser } from "../utils/authUser";
import Layout from "../components/Layout/Layout";
import "react-toastify/dist/ReactToastify.css";
import "semantic-ui-css/semantic.min.css";

function MyApp({ Component, pageProps }) {
  return (
    <Layout {...pageProps}>
      <Component {...pageProps} />
    </Layout>
  );
}

MyApp.getInitialProps = async ({ Component, ctx }) => {
  // Get the token from the cookies which is available in
  // ctx.req.headers.cookie
  const { token } = parseCookies(ctx);

  // This object will be returned, it represents props
  let pageProps = {};

  // Here we check for any route we want to be protected
  // Where unauthorized users shouldn't be able to have access
  const protectedRoutes =
    ctx.pathname === "/" ||
    ctx.pathname === "/[username]" ||
    ctx.pathname === "/post/[postId]" ||
    ctx.pathname === "/notifications";

  // Check for jwt token
  if (!token) {
    // If the user without the jwt token is trying to access a
    // protected route, redirect to login
    protectedRoutes && redirectUser(ctx, "/login");
  } else {
    if (Component.getInitialProps) {
      // This will be used if a component is using getInititalProps
      // in order to set it's props
      pageProps = await Component.getInitialProps(ctx);
    }
    try {
      // Request through which we get user and followers
      const res = await axios.get(`${baseUrl}/api/auth`, {
        headers: { Authorization: token },
      });
      const { user, userFollowStats } = res.data;

      // In case user is trying to access a route that shouldn't be
      // accessible by authenticated users
      if (user) !protectedRoutes && redirectUser(ctx, "/");
      pageProps.user = user;
      pageProps.userFollowStats = userFollowStats;
    } catch (error) {
      // If a user has an invalid token, destroy it and re-validate user
      destroyCookie(ctx, "token");
      redirectUser(ctx, "/login");
    }
  }
  return { pageProps };
};

export default MyApp;
