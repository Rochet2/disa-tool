import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Table, Button } from 'semantic-ui-react'
import asyncAction from '../../../../utils/asyncAction'

import { addCategory } from '../../services/categories'

import ModalForm from '../../../../utils/components/ModalForm'
import MultilingualField from '../../../../utils/components/MultilingualField'

export class CreateCategoryForm extends Component {
  addCategorySubmit = (e) => {
    this.props.addCategory({
      course_instance_id: this.props.courseId,
      eng_name: e.target.eng_name.value,
      fin_name: e.target.fin_name.value,
      swe_name: e.target.swe_name.value
    })
  }

  render() {
    const contentPrompt = 'Luo uusi kategoria.'
    return (
      <Table.Row className="CreateCategoryForm">
        <Table.Cell>
          <ModalForm
            header="Luo uusi kategoria"
            trigger={<Button className="addCategoryButton" icon={{ name: 'add' }} />}
            content={
              <div>
                <p>
                  {contentPrompt}.
                </p>
                <MultilingualField field="name" fieldDisplay="nimi" />
                <Button type="submit" color="green">Tallenna</Button>
              </div>
            }
          />
        </Table.Cell>
      </Table.Row>
    )
  }
}

CreateCategoryForm.propTypes = {
  courseId: PropTypes.number.isRequired,
  addCategory: PropTypes.func.isRequired
}

const mapDispatchToProps = dispatch => ({
  addCategory: asyncAction(addCategory, dispatch)
})

export default connect(null, mapDispatchToProps)(CreateCategoryForm)
