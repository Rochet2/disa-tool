import React, { Component } from 'react'
import { withRouter, Link } from 'react-router-dom'
import { Menu, Dropdown } from 'semantic-ui-react'

import { getLanguage, saveLanguage } from '../../utils/utils'

const languageOptions = [
  { key: 'fin', value: 'fin', text: 'Suomi' },
  { key: 'swe', value: 'swe', text: 'Svenska' },
  { key: 'eng', value: 'eng', text: 'English' }
]

class Nav extends Component {
  state = {
    activeItem: 'home',
    language: 'fin'
  }

  componentDidMount() {
    const language = getLanguage()
    if (language) {
      this.setState({ language })
    }
  }

  handleClick = (e, { name }) => {
    this.setState({ activeItem: name })
  }

  changeLanguage = async (e, { value }) => {
    await this.setState({ language: value })
    saveLanguage(this.state.language)
  }

  render() {
    const { activeItem, language } = this.state
    return (
      <nav>
        <Menu tabular>
          <Menu.Item
            header
            as={Link}
            to="/"
            name="home"
            active={activeItem === 'home'}
            onClick={this.handleClick}
          >
              DISA-työkalu
          </Menu.Item>
          <Menu.Item
            as={Link}
            to="/user"
            name="user"
            active={activeItem === 'user'}
            onClick={this.handleClick}
          >
              Oma sivu
          </Menu.Item>
          <Menu.Item
            as={Link}
            to="/course"
            name="course"
            active={activeItem === 'course'}
            onClick={this.handleClick}
          >
              Kurssi
          </Menu.Item>
          <Menu.Item
            as={Link}
            to="/selfAssesment"
            name="assessment"
            active={activeItem === 'assessment'}
            onClick={this.handleClick}
          >
              Itsearvio
          </Menu.Item>
          <Menu.Menu position="right">
            <Menu.Item>
              <Dropdown
                options={languageOptions}
                value={language}
                onChange={this.changeLanguage}
              />
            </Menu.Item>
          </Menu.Menu>
        </Menu>
      </nav>
    )
  }
}

export default withRouter(Nav)
