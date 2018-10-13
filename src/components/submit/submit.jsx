import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';

import styled from 'styled-components';

import {setGenre as setGenreAction} from '../../ducks/settings';
import {
  updateSubmit as updateSubmitAction,
  submitArtist as submitArtistAction
} from '../../ducks/submit';

import GenreSelector from '../genre-selector';

const Container = styled.div`
  position: absolute;
  background: rgba(0, 0, 0, 0.6);
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Content = styled.div`
  width: 550px;
  background: #ffffff;
`;

const Header = styled.div`
  width: 100%;
  padding: 40px 30px 20px 30px;
  background: ${props => props.background};
  color: #ffffff;
`;

const Body = styled.div`
  width: 100%;
  padding: 40px 30px;
`;

const Input = styled.input`
  width: 100%;
  margin: 8px 0;
  height: 40px;
  border: 1px solid ${props => (props.error ? 'red' : 'grey')};
`;

const ButtonsContainer = styled.div`
  width: 100%;
`;

const CancelButton = styled.button`
  width: 50%;
`;

const SubmitButton = styled.button`
  width: 50%;
  background: ${props => props.background};
  color: #ffffff;
`;

export class Submit extends Component {
  componentDidMount() {
    // eslint-disable-next-line
    const autocomplete = new kt.OsmNamesAutocomplete(
      'autocomplete',
      'https://geocoder.tilehosting.com/',
      'sg3YTg5zBN0fMMNWkmDR'
    );
    autocomplete.registerCallback(result => this.handleGeocodeResult(result));
  }

  handleGeocodeResult(result) {
    const {name, lon, lat} = result;

    if (!name || !lon || !lat) {
      console.log('no good result');
      return;
    }

    this.props.updateSubmit({
      name: 'locationName',
      data: name
    });
    this.props.updateSubmit({
      name: 'coordinates',
      data: {lat, lng: lon}
    });
  }

  handleInput(event) {
    const {target} = event;

    this.props.updateSubmit({
      name: target.name,
      data: target.value
    });
  }

  render() {
    const {submit} = this.props;
    const {errors} = submit;

    return (
      <Container>
        <Content>
          <Header background={this.props.genre.color}>Submit new artist</Header>
          <Body>
            <Input
              error={errors.name}
              onChange={event => this.handleInput(event)}
              placeholder="Name of the artist"
              autocomplete="off"
              type="text"
              name="name"
              value={submit.name}
            />
            <Input
              error={errors.locationName}
              onChange={event => this.handleInput(event)}
              placeholder="Location of the artist"
              id="autocomplete"
              autocomplete="off"
              type="text"
              name="locationName"
              value={submit.locationName}
            />
            <GenreSelector onChange={genre => this.props.setGenre(genre)} />
            <Input
              error={errors.infoLink}
              onChange={event => this.handleInput(event)}
              placeholder="Info link (Discogs or Wikipedia)"
              autocomplete="off"
              type="text"
              name="infoLink"
              value={submit.infoLink}
            />
            <Input
              onChange={event => this.handleInput(event)}
              placeholder="Description (optional)"
              autocomplete="off"
              type="text"
              name="description"
              value={submit.description}
            />
            <Input
              error={errors.mediaLink}
              onChange={event => this.handleInput(event)}
              placeholder="Music link from Soundcloud, Mixcloud or Youtube"
              autocomplete="off"
              type="text"
              name="mediaLink"
              value={submit.mediaLink}
            />
            <Input
              onChange={event => this.handleInput(event)}
              placeholder="Facebook link (optional)"
              autocomplete="off"
              type="text"
              name="facebookLink"
              value={submit.facebookLink}
            />
            <Input
              onChange={event => this.handleInput(event)}
              placeholder="Instagram link (optional)"
              autocomplete="off"
              type="text"
              name="instagramLink"
              value={submit.instagramLink}
            />
            <Input
              onChange={event => this.handleInput(event)}
              placeholder="Twitter link (optional)"
              autocomplete="off"
              type="text"
              name="twitterLink"
              value={submit.twitterLink}
            />
            <Input
              onChange={event => this.handleInput(event)}
              placeholder="Website link (optional)"
              autocomplete="off"
              type="text"
              name="websiteLink"
              value={submit.websiteLink}
            />
            <Input
              onChange={event => this.handleInput(event)}
              placeholder="Your name (optional)"
              autocomplete="off"
              type="text"
              name="user"
              value={submit.user}
            />
            <ButtonsContainer>
              <CancelButton onClick={() => this.props.history.goBack()}>
                Cancel
              </CancelButton>
              <SubmitButton
                background={this.props.genre.color}
                onClick={() => this.props.submitArtist(this.props.history)}>
                Submit artist
              </SubmitButton>
            </ButtonsContainer>
          </Body>
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = ({settings, submit}) => ({
  genre: settings.genre,
  submit
});

const mapDispatchToProps = dispatch => ({
  setGenre: genre => dispatch(setGenreAction(genre)),
  updateSubmit: data => dispatch(updateSubmitAction(data)),
  submitArtist: history => dispatch(submitArtistAction(history))
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Submit)
);
