import React, {Component} from 'react';
import styled from 'styled-components';
import ReactPlayer from 'react-player';
import wiki from 'wikijs';

const Container = styled.div`
  width: 450px;
  font-family: 'Noto Sans', sans-serif;
`;

const Info = styled.div`
  padding: 25px;
`;

const Name = styled.span`
  font-size: 16px;
  font-weight: 700;
  display: inline-block;
`;

const Summary = styled.span`
  font-size: 14px;
  margin-top: 15px;
  line-height: 1.4;
  display: inline-block;
`;

const Player = styled.div`
  width: 100%;
  height: 130px;

  > div {
    width: 100% !important;
    height: 100% !important;
  }
`;

export default class Popup extends Component {
  constructor() {
    super();
    this.state = {summary: null};
  }

  componentDidMount() {
    this.getWikiSummary();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.artist.properties.id !== this.props.artist.properties.id) {
      this.setState({summary: null});
      this.getWikiSummary();
    }
  }

  getWikiSummary() {
    if (!this.props.artist.properties.wikipedia) {
      return;
    }

    const wikiSplit = this.props.artist.properties.wikipedia.split('/');
    const wikisPage =
      wikiSplit[wikiSplit.length - 1] || wikiSplit[wikiSplit.length - 2];

    return wiki()
      .page(wikisPage)
      .then(page => {
        return page.summary();
      })
      .then(summary =>
        this.setState({
          summary: `${summary.substr(0, 300)}\u2026`
        })
      );
  }

  render() {
    return (
      <Container>
        <Info>
          <Name>{this.props.artist.properties.name}</Name>
          {this.state.summary && <Summary>{this.state.summary}</Summary>}
        </Info>
        {this.props.artist.properties.soundcloud && (
          <Player>
            <ReactPlayer url={this.props.artist.properties.soundcloud} />
          </Player>
        )}
      </Container>
    );
  }
}
