import React, { Component } from 'react'
import { func, shape, number } from 'prop-types'
import { connect } from 'react-redux'
import { Container, Form, Label, Input, Button, Segment } from 'semantic-ui-react'
import { Redirect } from 'react-router'
import './form.css'

import { loginAction } from '../../../../actions/actions'


export class LoginForm extends Component {
  state = {
    emptyFields: {
      username: true,
      password: true
    },
    redirect: false
  }

  login = (e) => {
    e.preventDefault()
    this.props.loginAction({
      username: e.target.username.value,
      password: e.target.password.value
    })
      .then(() => this.setState({ redirect: true }))
      .catch(() => {})
  }

  changeField = fieldName => (e) => {
    this.setState({
      emptyFields: {
        ...this.state.emptyFields,
        [fieldName]: e.target.value === ''
      }
    })
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to="/user" />
    }
    return (
      <Container>
        <Segment>
          {this.props.user.id ?
            <h5>{`Olet jo kirjautunut sisään, ${this.props.user.name}.`}</h5> :
            <Form onSubmit={this.login}>
              <Form.Field width={16} inline>
                <Label>käyttäjänimi</Label>
                <Input name="username" type="text" onChange={this.changeField('username')} />
              </Form.Field>
              <Form.Field width={16} inline>
                <Label>salasana</Label>
                <Input name="password" type="password" onChange={this.changeField('password')} />
              </Form.Field>
              <Button
                type="submit"
                disabled={!Object.values(this.state.emptyFields).every(value => !value)}
                color={!Object.values(this.state.emptyFields).every(value => !value) ? undefined : 'green'}
              >
                Login
              </Button>
            </Form>}
        </Segment>
      </Container>
    )
  }
}

LoginForm.propTypes = {
  user: shape({ id: number }),
  loginAction: func.isRequired
}

LoginForm.defaultProps = {
  user: {}
}

const mapStateToProps = state => ({
  user: state.user
})

export default connect(mapStateToProps, { loginAction })(LoginForm)
