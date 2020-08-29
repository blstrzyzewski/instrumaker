import React, { Fragment } from "react";
import { Container, Header } from "semantic-ui-react";
import Navbar from "./navbar";
function About() {
  return (
    <Fragment>
      <Navbar props="about" />
      <h1
        style={{
          color: "white",
          marginTop: "5%",
          textDecoration: "underline",
          textAlign: "center",
        }}
      >
        About
      </h1>
      <Container className="about-container" text>
        <Header as="h2" style={{ color: "white" }}>
          Generation
        </Header>
        <p>
          Instrumaker is a randomized hip hop instrumental generator. It
          randomly chooses between many samples from Splice and arranges them in
          a random but guided way to create instrumentals.
        </p>
        <p>
          To generate the lead, Instrumaker randomly chooses between three
          generation routines. The first is synths. When the synths generation
          routine is chosen, Instrumaker randomly chooses a synth one shot.
          Using the root note of that one shot as the key of the song, the one
          shot is transposed to make the notes in the minor key of the root
          note. A randomized 4 bar melody is then generated using these notes.
          The second lead generation routine is chords. This generation routine
          is similar to the one for synths except only the root, the perfect
          fourth, and the perfect fifth are used as possible notes. The
          generated lead progression is 4 bars instead of 2 as well.
        </p>
        <Header as="h2" style={{ color: "white" }}>
          Contact
        </Header>
        <p>
          Check out this project on{" "}
          <a href="https://github.com/blstrzyzewski/instrumaker">github</a>.
          Click <a href="https://www.buymeacoffee.com/brandonls">here</a> to buy
          me a cup of coffee if you enjoy the project 😀.{" "}
        </p>
      </Container>
    </Fragment>
  );
}
export default About;
