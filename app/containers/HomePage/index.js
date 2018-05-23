/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import Iframe from 'react-iframe';
import Muscles from 'data/muscle_data';

import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';

import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import { makeSelectError, makeSelectLoading, makeSelectRepos } from 'containers/App/selectors';
import Section from './Section';
import { loadRepos } from '../App/actions';
import { changeUsername } from './actions';
import { makeSelectUsername } from './selectors';
import reducer from './reducer';
import saga from './saga';

export class HomePage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  /**
   * when initial state username is not null, submit the form to load repos
   */
  componentDidMount() {
    const human = new HumanAPI('myHuman');

    console.log('Listening for human.ready event');

    human.on('human.ready', () => {
      console.log('Human loaded!');
    });

    human.on('scene.objectsSelected', (map) => {
      const names = Muscles.getMuscleNames(Object.keys(map), { gender: 'male' });
      Muscles.getMuscleIds(names, { gender: 'male' });
    });
  }


  render() {
    const female = false;
    let iframe;
    if (female) {
      iframe = (<Iframe
        url="https://human.biodigital.com/widget/?m=production/femaleAdult/female_system_anatomy_muscular_whole.json&uaid=2iUS3&dk=468d8a2ac64ad5c3ed22c36efc08a4e52f8a71fc"
        width="450px"
        height="450px"
        id="myHuman"
        display="initial"
        position="relative"
        allowFullScreen
      />);
    } else {
      iframe = (<Iframe
        url="https://human.biodigital.com/widget/?m=production/maleAdult/male_system_anatomy_muscular_whole.json&uaid=2iUS3&dk=468d8a2ac64ad5c3ed22c36efc08a4e52f8a71fc"
        width="450px"
        height="450px"
        id="myHuman"
        display="initial"
        position="relative"
        allowFullScreen
      />);
    }


    return (
      <article>
        <Helmet>
          <title>Home Page</title>
          <meta name="description" content="A React.js Boilerplate application homepage" />
        </Helmet>
        <div>
          <Section>
            {iframe}
          </Section>
        </div>
      </article>
    );
  }
}

HomePage.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.bool,
  ]),
  repos: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.bool,
  ]),
  onSubmitForm: PropTypes.func,
  username: PropTypes.string,
  onChangeUsername: PropTypes.func,
};

export function mapDispatchToProps(dispatch) {
  return {
    onChangeUsername: (evt) => dispatch(changeUsername(evt.target.value)),
    onSubmitForm: (evt) => {
      if (evt !== undefined && evt.preventDefault) evt.preventDefault();
      dispatch(loadRepos());
    },
  };
}

const mapStateToProps = createStructuredSelector({
  repos: makeSelectRepos(),
  username: makeSelectUsername(),
  loading: makeSelectLoading(),
  error: makeSelectError(),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'home', reducer });
const withSaga = injectSaga({ key: 'home', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(HomePage);
