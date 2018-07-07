import React, {Component} from 'react';
import {connect} from 'react-redux';

import styled from 'styled-components';

import {setGenre as setGenreAction} from '../../ducks/settings';

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

const Name = styled.input`
  width: 100%;
`;

const Description = styled.input`
  width: 100%;
`;

const InfoUrl = styled.input`
  width: 100%;
`;

const MediaUrl = styled.input`
  width: 100%;
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
  render() {
    return (
      <Container>
        <Content>
          <Header background={this.props.genre.color}>Submit new artist</Header>
          <Body>
            <Name placeholder="Name of the artist" type="text" name="name" />
            <GenreSelector onChange={genre => this.props.setGenre(genre)} />
            <InfoUrl
              placeholder="Link about the artist"
              type="text"
              name="info"
            />
            <Description
              placeholder="Description text (optional)"
              type="text"
              name="description"
            />
            <MediaUrl
              placeholder="Link from Soundcloud, Mixcloud or Youtube"
              type="text"
              name="media"
            />
            <ButtonsContainer>
              <CancelButton>Cancel</CancelButton>
              <SubmitButton background={this.props.genre.color}>
                Submit artist
              </SubmitButton>
            </ButtonsContainer>
          </Body>
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = ({settings}) => ({
  genre: settings.genre
});

const mapDispatchToProps = dispatch => ({
  setGenre: genre => dispatch(setGenreAction(genre))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Submit);
