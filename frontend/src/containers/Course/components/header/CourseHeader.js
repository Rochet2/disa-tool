import React from 'react'
import { number, shape, string, bool, func } from 'prop-types'
import { connect } from 'react-redux'
import { withLocalize } from 'react-localize-redux'
import { Link } from 'react-router-dom'
import { Button, Segment, Header } from 'semantic-ui-react'
import './header.css'

export const CourseHeader = props => (
  <div className="CourseHeader">
    <Segment>
      <Header as="h1" textAlign="center">
        {props.renderReturnLink ? (<Button
          as={Link}
          to={`/user/course/${props.course.id}`}
          basic
          color="blue"
          floated="left"
          icon="backward"
          content={props.translate('Course.header.CourseHeader.back_button')}
        />) : null}
        {props.course.name}
      </Header>
    </Segment>
  </div>
)

CourseHeader.propTypes = {
  course: shape({
    id: number.isRequired,
    name: string.isRequired
  }).isRequired,
  renderReturnLink: bool,
  translate: func.isRequired
}

CourseHeader.defaultProps = {
  renderReturnLink: true
}

const mapStateToProps = state => ({
  course: state.course.course
})

export default withLocalize(connect(mapStateToProps, null)(CourseHeader))
