import React from 'react'
import { connect } from 'react-redux'
import { Card, Form, Button } from 'semantic-ui-react'
import PropTypes from 'prop-types'
import MultiLangInput from '../MultiLangInput'
import AddOpenQuestion from '../addOpenQuestion'
import { changeHeaderAction } from '../../../../../actions/actions'

class SelfAssesmentSection extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      editHeaders: false,
      changedHeaders: {}
    }
  }

  toggleEdit = () => {
    this.props.dispatchHeaderChange({ changedHeaders: this.state.changedHeaders, headerType: this.props.headerType })
    this.setState({ editHeaders: !this.state.editHeaders })
  }

  changeHeader = (id, value) => {
    const oldState = this.state.changedHeaders
    oldState[id] = value
    this.setState({ editHeaders: oldState })
  }

  render() {
    const { final, question, formData, edit, textArea, QuestionModule, headers, headerType } = this.props
    const { editHeaders } = this.state
    let h = this.props.headers[0].value

    let questionEditField = null
    if (final) {
      h =
        (
          <div>
            {h}
            <Button
              onClick={() => this.toggleEdit()}
              style={{ marginLeft: '10px' }} >
              {editHeaders ? 'Näytä' : 'Muokkaa'}
            </Button>
          </div>)
    }

    if (editHeaders) {
      questionEditField =
        (
          <div style={{
            marginBottom: '10px'
          }}
          >
            <Form>
              <MultiLangInput
                headers={headers}
                handleChange={this.changeHeader}
              />
            </Form>
          </div>

        )
    }

    return (
      <div>
        <Card fluid color="red" className="formCard">
          <Card.Content>
            <Card.Header className="cardHead">
              {h}
            </Card.Header>
            <Card.Description>
              {questionEditField}
            </Card.Description>
            <Form>
              {formData.map(questionModules =>
                (<QuestionModule
                  key={questionModules.id}
                  data={questionModules}
                  edit={edit}
                  textArea={textArea}
                  final={final}
                />))}

              {question ?
                <AddOpenQuestion />
                :
                null
              }
            </Form>
          </Card.Content>
        </Card>
      </div >

    )
  }
}

SelfAssesmentSection.defaultProps = {
  question: false,
  final: false
}

SelfAssesmentSection.propTypes = {
  formData: PropTypes.oneOfType([
    PropTypes.shape(),
    PropTypes.arrayOf(PropTypes.shape())
  ]).isRequired,
  edit: PropTypes.bool.isRequired,
  textArea: PropTypes.func.isRequired,
  question: PropTypes.bool,
  header: PropTypes.string.isRequired,
  QuestionModule: PropTypes.func.isRequired,
  final: PropTypes.bool
}

const mapDispatchToProps = dispatch => ({
  dispatchHeaderChange: data =>
    dispatch(changeHeaderAction(data))
})

export default connect(null, mapDispatchToProps)(SelfAssesmentSection)
