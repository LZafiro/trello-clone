import { authMiddleware, redirectToSignIn } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export default authMiddleware({
  publicRoutes: ["/"],
  afterAuth(auth, req) {
    // User is authenticated and is trying to access a public route
    // Forces to redirect to the organization page. If the user has no organization,
    // it will redirect to the select organization page
    if (auth.userId && auth.isPublicRoute) {
      let path;
      if (auth.orgId) {
        path = `/organization/${auth.orgId}`;
      } else {
        path = "/select-org";
      }
      const url = new URL(path, req.url);
      return NextResponse.redirect(url);
    }
    // If the user is not authenticated and is trying to access a private route
    // redirect to the sign in page (this must be specified because "afterAuth"
    // overrides the default behavior of the authMiddleware function)
    if (!auth.userId && !auth.isPublicRoute) {
      return redirectToSignIn({ returnBackUrl: req.url });
    }
    // If the user is authenticated and has no organization, redirect to the select organization page
    if (auth.userId && !auth.orgId && req.nextUrl.pathname !== "/select-org") {
      const url = new URL("/select-org", req.url);
      return NextResponse.redirect(url);
    }
  },
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
