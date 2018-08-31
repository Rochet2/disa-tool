import { Form, Card, Grid, Dropdown, Accordion, Icon, Message } from 'semantic-ui-react'
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withLocalize } from 'react-localize-redux'
import {
  gradeCategoryAction,
  textfieldResponseAction,
  toggleTextField,
  toggleFormPartAction,
  changeHeaderAction
} from '../../../actions/selfAssesment'
import MatrixPage from '../../../../Course/MatrixPage'

export class CategoryQuestionModule extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      editHeaders: false,
      changedHeaders: {},
      showMatrix: false
    }
  }


  toggleEdit = () => {
    this.setState({ editHeaders: !this.state.editHeaders })
    this.props.dispatchHeaderChange({ changedHeaders: this.state.changedHeaders })
  }

  changeHeader = (id, value) => {
    const oldState = this.state.changedHeaders
    oldState[id] = value
    this.setState({ editHeaders: oldState })
  }

  render() {
    const { edit,
      final,
      responseTextError,
      gradeError,
      clearError,
      courseInstanceId,
      grades } = this.props
    const { name, textFieldOn, id } = this.props.data
    const translate = translateId => this.props.translate(`SelfAssessment.Userform.FormParts.QuestionModules.CategoryQuestionModule.${translateId}`)

    return (
      <div className="CategoryQuestion">
        <Form error={gradeError !== undefined}>
          <Form.Field>
            <div>
              <Card fluid>
                <Card.Content >
                  <Card.Header>
                    {name}
                    <Accordion style={{ marginTop: '10px' }} fluid styled>
                      <Accordion.Title
                        active={this.state.showMatrix}
                        onClick={() => this.setState({ showMatrix: !this.state.showMatrix })}
                      >
                        <Icon name="dropdown" />
                        {translate('matrix')}
                      </Accordion.Title>
                      <Accordion.Content active={this.state.showMatrix}>
                        <MatrixPage
                          courseId={courseInstanceId}
                          hideHeader
                          categoryId={id}
                        />
                      </Accordion.Content>
                    </Accordion>
                  </Card.Header>
                  <Grid verticalAlign="middle" padded columns={3}>
                    <Grid.Row >
                      <Form.Field width={10}>
                        <Grid.Column>
                          <div>
                            <label> {translate('assessment')}</label>
                            <Dropdown
                              style={{ marginLeft: '20px' }}
                              placeholder={translate('gradeSelect')}
                              selection
                              options={grades}
                              error={gradeError !== undefined}
                              onChange={!edit ? (e, { value }) => {
                                this.props.dispatchGradeCategoryAction({ id, value, final })
                                clearError({ type: final ? 'finalGErrors' : 'qModErrors', errorType: 'grade', id })
                              } : null}
                            />
                          </div>
                          <Message
                            error
                            content={gradeError ? gradeError.error : null}
                          />
                        </Grid.Column>
                      </Form.Field>
                      <Grid.Column />
                    </Grid.Row>
                    <Grid.Row >
                      <Form.Field width={10}>
                        <Grid.Column>
                          {textFieldOn ?
                            <Form.TextArea
                              autoHeight
                              error={responseTextError !== undefined}
                              label={translate('basis')}
                              placeholder={translate('writeBasis')}
                              onBlur={!edit ? e =>
                                this.props.dispatchTextfieldResponseAction({
                                  id,
                                  value: e.target.value,
                                  final
                                })
                                :
                                null}
                              onChange={!edit ? () =>
                                clearError({ type: final ? 'finalGErrors' : 'qModErrors', errorType: 'responseText', id })
                                :
                                null
                              }
                            />
                            :
                            null
                          }
                        </Grid.Column>
                      </Form.Field>
                    </Grid.Row>
                  </Grid>
                </Card.Content>
              </Card>
            </div>
          </Form.Field >
        </Form>
      </div>
    )
  }
}

CategoryQuestionModule.defaultProps = {
  final: false,
  courseInstanceId: null,
  responseTextError: undefined,
  gradeError: undefined
}


CategoryQuestionModule.propTypes = {
  data: PropTypes.shape({
    name: PropTypes.string,
    id: PropTypes.number,
    headers: PropTypes.arrayOf(PropTypes.shape()),
    textFieldOn: PropTypes.bool
  }).isRequired,
  final: PropTypes.bool,
  dispatchHeaderChange: PropTypes.func.isRequired,
  dispatchTextfieldResponseAction: PropTypes.func.isRequired,
  dispatchGradeCategoryAction: PropTypes.func.isRequired,
  responseTextError: PropTypes.shape(),
  gradeError: PropTypes.shape(),
  clearError: PropTypes.func.isRequired,
  courseInstanceId: PropTypes.number,
  edit: PropTypes.bool.isRequired,
  grades: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.number,
    value: PropTypes.number,
    text: PropTypes.string
  })).isRequired,
  translate: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  answers: state.selfAssesment.assesmentResponse
})

const mapDispatchToProps = dispatch => ({
  dispatchTextFieldOnOff: id =>
    dispatch(toggleTextField(id)),
  dispatchToggleFormPartAction: (id, type) =>
    dispatch(toggleFormPartAction(id, type)),
  dispatchHeaderChange: data =>
    dispatch(changeHeaderAction(data)),
  dispatchTextfieldResponseAction: data =>
    dispatch(textfieldResponseAction(data)),
  dispatchGradeCategoryAction: data =>
    dispatch(gradeCategoryAction(data))
})

export default withLocalize(connect(mapStateToProps, mapDispatchToProps)(CategoryQuestionModule))
