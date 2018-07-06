import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Form, Button, Dropdown, Grid, Label } from 'semantic-ui-react'

import { addTypeToTask } from '../../services/tasks'

import ModalForm from '../../../../utils/components/ModalForm'

class AddTypeForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      options: [],
      typeSelection: undefined
    }
  }

  prepareOptions = () => {
    let options = []
    const excluded = {}
    this.props.typeIds.forEach((id) => {
      excluded[id] = true
    })
    options = this.props.types
      .filter(type => !excluded[type.id])
      .map(type => ({
        key: type.id,
        value: type.id,
        text: type.name
      }))
    if (options === []) {
      options.push({
        text: '<CannotAddMore>',
        value: null
      })
    }
    this.setState({
      options
    })
  }

  changeTypeSelection = (e, { value }) => {
    this.setState({
      typeSelection: value
    })
  }

  addTypeSubmit = (e) => {
    e.preventDefault()
    addTypeToTask({
      taskId: this.props.task.id,
      typeId: this.state.typeSelection
    }).then((response) => {
      console.log(response)
    })
  }

  render() {
    return (
      <Grid.Row>
        <Grid.Column textAlign="right">
          <div className="addTypeForm">
            <ModalForm
              header="placeholder content"
              trigger={<Button icon={{ name: 'add' }} onClick={this.prepareOptions} />}
              content={
                <div>
                  <Form.Field>
                    <Label>type</Label>
                    <Dropdown
                      name="type"
                      className="typeDropdown"
                      options={this.state.options}
                      selection
                      value={this.state.typeSelection}
                      onChange={this.changeTypeSelection}
                    />
                  </Form.Field>
                  <Button type="submit">Tallenna</Button>
                </div>
              }
              onSubmit={this.addTypeSubmit}
            />
          </div>
        </Grid.Column>
      </Grid.Row>
    )
  }
}

AddTypeForm.propTypes = {
  typeIds: PropTypes.arrayOf(PropTypes.number).isRequired,
  task: PropTypes.shape({
    id: PropTypes.number.isRequired
  }).isRequired,
  types: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string.isRequired
  })).isRequired
}

const mapStateToProps = (state, ownProps) => (
  {
    ...ownProps,
    types: state.type.types
  }
)

export default connect(mapStateToProps, null)(AddTypeForm)
