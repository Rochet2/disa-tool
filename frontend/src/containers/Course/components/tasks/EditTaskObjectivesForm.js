import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Button, Form, Input, Label, Container } from 'semantic-ui-react'
import asyncAction from '../../../../utils/asyncAction'

import { editTaskObjectives } from '../../actions/tasks'

import ModalForm from '../../../../utils/components/ModalForm'

class EditTaskObjectivesForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      detailed: true,
      values: this.props.objectives.reduce(
        (acc, curr) => ({
          ...acc,
          [curr.id]: {
            multiplier: curr.multiplier,
            modified: null
          }
        }),
        {}
      )
    }
  }

  componentWillReceiveProps(newProps) {
    if (newProps.taskId !== this.props.taskId
      || newProps.objectives.length !== this.props.objectives.length) {
      this.setState({
        values: newProps.objectives.reduce(
          (acc, curr) => ({
            ...acc,
            [curr.id]: {
              multiplier: curr.multiplier,
              modified: null
            }
          }),
          {}
        )
      })
    }
  }

  changeMultiplier = id => e => this.setState({
    values: {
      ...this.state.values,
      [id]: {
        ...this.state.values[id],
        multiplier: e.target.value
      }
    }
  })

  changeModified = (id, modified) => () => this.setState({
    values: {
      ...this.state.values,
      [id]: {
        multiplier: {
          null: this.props.objectives.find(objective => objective.id === id).multiplier,
          false: this.props.defaultMultiplier,
          true: this.state.values[id].multiplier
        }[modified],
        modified
      }
    }
  })

  changeAllMultipliers = e => this.setState({
    values: Object.keys(this.state.values).reduce((acc, curr) => ({
      ...acc,
      [curr]: {
        ...this.state.values[curr],
        multiplier: e.target.value
      }
    }), {})
  })

  changeAllModified = modified => () => this.setState({
    values: Object.keys(this.state.values).reduce((acc, curr) => ({
      ...acc,
      [curr]: {
        modified,
        multiplier: modified ? this.state.values[curr].multiplier : this.props.defaultMultiplier
      }
    }), {})
  })

  editTaskObjectivesSubmit = () => this.props.editTaskObjectives({
    task_id: this.props.taskId,
    objectives: this.props.objectives.map(objective => ({
      ...this.state.values[objective.id],
      id: objective.id
    })).filter(objective => objective.modified !== null)
  })

  render() {
    return (
      <div className="EditTaskObjectivesForm" style={{ display: 'none' }}>
        <ModalForm
          expanded={this.props.expanded}
          header="Muokkaa kertoimia"
          trigger={<div />}
          content={
            <div>
              <Container className="header" textAlign="right">
                <Button.Group size="large">
                  <Button
                    type="button"
                    onClick={() => this.setState({ detailed: false })}
                    content="Kaikki"
                    color={this.state.detailed ? undefined : 'blue'}
                  />
                  <Button.Or text="tai" />
                  <Button
                    type="button"
                    onClick={() => this.setState({ detailed: true })}
                    content="Yksittäin"
                    color={this.state.detailed ? 'blue' : undefined}
                  />
                </Button.Group>
              </Container>
              {this.state.detailed ? (
                this.props.objectives.map(objective => (
                  <Form.Field key={objective.id}>
                    <Container>
                      <Label basic size="large">{objective.name}</Label>
                    </Container>
                    <Container>
                      <Button.Group size="small">
                        <Button
                          type="button"
                          content="Pidä ennallaan"
                          color={this.state.values[objective.id].modified === null ? 'blue' : undefined}
                          onClick={this.changeModified(objective.id, null)}
                        />
                        <Button.Or text="tai" />
                        <Button
                          type="button"
                          content="Palauta oletusarvoon"
                          color={this.state.values[objective.id].modified === false ? 'blue' : undefined}
                          onClick={this.changeModified(objective.id, false)}
                        />
                        <Button.Or text="tai" />
                        <Button
                          type="button"
                          content="Muuta"
                          color={this.state.values[objective.id].modified === true ? 'blue' : undefined}
                          onClick={this.changeModified(objective.id, true)}
                        />
                      </Button.Group>
                      <Input
                        className="multiplierInput"
                        value={this.state.values[objective.id].multiplier}
                        onChange={this.changeMultiplier(objective.id)}
                        name={`objective ${objective.id}`}
                        type="number"
                        min={0}
                        max={1}
                        step={0.01}
                        disabled={!this.state.values[objective.id].modified}
                      />
                    </Container>
                  </Form.Field>
                ))
              ) : (
                <Form.Field>
                  <Container>
                    <Label basic size="large">Kaikki</Label>
                  </Container>
                  <Container>
                    <Button.Group size="small">
                      <Button
                        type="button"
                        content="Palauta oletusarvoon"
                        color={Object.values(this.state.values)[0].modified === false ? 'blue' : undefined}
                        onClick={this.changeAllModified(false)}
                      />
                      <Button.Or text="tai" />
                      <Button
                        type="button"
                        content="Muuta"
                        color={Object.values(this.state.values)[0].modified === true ? 'blue' : undefined}
                        onClick={this.changeAllModified(true)}
                      />
                    </Button.Group>
                    <Input
                      className="multiplierInput"
                      value={Object.values(this.state.values)[0].multiplier}
                      onChange={this.changeAllMultipliers}
                      name="all"
                      type="number"
                      min={0}
                      max={1}
                      step={0.01}
                      disabled={!Object.values(this.state.values)[0].modified}
                    />
                  </Container>
                </Form.Field>
              )}
              <Button color="green">Tallenna</Button>
            </div>
          }
          onSubmit={this.editTaskObjectivesSubmit}
          onClose={this.props.onClose}
        />
      </div>
    )
  }
}

EditTaskObjectivesForm.propTypes = {
  taskId: PropTypes.number.isRequired,
  editTaskObjectives: PropTypes.func.isRequired,
  objectives: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    multiplier: PropTypes.number.isRequired
  })).isRequired,
  defaultMultiplier: PropTypes.number.isRequired,
  expanded: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
}

const mapStateToProps = (state, ownProps) => {
  const taskObjectives = state.task.tasks
    .find(task => task.id === ownProps.taskId).objectives
    .reduce(
      (acc, curr) => ({ ...acc, [curr.id]: { multiplier: curr.multiplier } }),
      {}
    )
  const objectives = state.category.categories
    .reduce(
      (acc, curr) => acc.concat(curr.skill_levels.reduce(
        (acc2, curr2) => acc2.concat(curr2.objectives
          .filter(objective => taskObjectives[objective.id]).map(objective => ({
            ...objective,
            multiplier: taskObjectives[objective.id].multiplier
          }))),
        []
      )),
      []
    )
  return {
    taskId: ownProps.taskId,
    expanded: ownProps.expanded,
    onClose: ownProps.onClose,
    objectives,
    defaultMultiplier: state.task.tasks.find(task => task.id === ownProps.taskId).defaultMultiplier
  }
}

const mapDispatchToProps = dispatch => ({
  editTaskObjectives: asyncAction(editTaskObjectives, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(EditTaskObjectivesForm)
