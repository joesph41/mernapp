import React, { createRef } from "react";
import HeadTags from "./HeadTags";
import Navbar from "./Navbar";
import {
  Container,
  Visibility,
  Grid,
  Sticky,
  Ref,
  Divider,
  Segment,
} from "semantic-ui-react";
import nprogress from "nprogress";
import Router from "next/router";
import SideMenu from "./SideMenu";
import Search from "./Search";

function Layout({ children, user }) {
  const contextRef = createRef();

  Router.onRouteChangeStart = () => {
    console.log("router change start");
    nprogress.start();
  };

  Router.onRouteChangeComplete = () => {
    nprogress.done();
  };

  Router.onRouteChangeError = () => {
    nprogress.done();
  };

  return (
    <>
      <HeadTags />
      {user ? (
        <>
          <div style={{ marginLeft: "1rem", marginRight: "1rem" }}>
            <Ref innerRef={contextRef}>
              <Grid>
                <Grid.Column floated="left" width={2}>
                  <Sticky context={contextRef}>
                    <SideMenu user={user} />
                  </Sticky>
                </Grid.Column>

                <Grid.Column width={10}>
                  <Visibility context={contextRef}>{children}</Visibility>
                </Grid.Column>

                <Grid.Column floated="left" width={4}>
                  <Sticky context={contextRef}>
                    <Segment basic>
                      <Search />
                    </Segment>
                  </Sticky>
                </Grid.Column>
              </Grid>
            </Ref>
          </div>
        </>
      ) : (
        <>
          <Navbar />

          <Container style={{ paddingTop: "1rem" }} text>
            {children}
          </Container>
        </>
      )}
    </>
  );
}

export default Layout;
