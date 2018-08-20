const { Category, Objective, SkillLevel, TaskObjective } = require('../database/models.js')
const editServices = require('../utils/editServices.js')

const getAllCategories = () => Category.findAll()

const getCourseCategories = (courseInstanceId, lang) => (
  Category.findAll({
    attributes: ['id', [`${lang}_name`, 'name']],
    include: {
      model: Objective,
      attributes: ['id', 'course_instance_id', 'skill_level_id', [`${lang}_name`, 'name']],
      where: { course_instance_id: courseInstanceId }
    }
  })
)

const create = {
  prepare: async (data) => {
    const instance = Category.build({
      course_instance_id: data.course_instance_id,
      eng_name: data.eng_name,
      fin_name: data.fin_name,
      swe_name: data.swe_name
    })
    const skillLevels = await SkillLevel.findAll({
      where: {
        course_instance_id: data.course_instance_id
      },
      attributes: ['id']
    })
    return [instance, skillLevels]
  },
  execute: instance => instance.save(),
  value: (instance, skillLevels, lang) => {
    const json = instance.toJSON()
    return {
      id: json.id,
      name: json[`${lang}_name`],
      skill_levels: skillLevels.map(level => ({
        id: level.id,
        objectives: []
      }))
    }
  }
}

const deleteCategory = {
  prepare: id => Category.findById(id, {
    include: {
      model: Objective,
      attributes: ['id'],
      include: {
        model: TaskObjective,
        attributes: ['task_id']
      }
    }
  }),
  value: (instance) => {
    const json = instance.toJSON()
    const tasks = {}
    json.objectives.forEach((objective) => {
      objective.task_objectives.forEach((taskObjective) => {
        if (!tasks[taskObjective.task_id]) {
          tasks[taskObjective.task_id] = {
            id: taskObjective.task_id,
            objective_ids: []
          }
        }
        tasks[taskObjective.task_id].objective_ids.push(objective.id)
      })
    })
    return {
      id: json.id,
      tasks: Object.values(tasks)
    }
  },
  execute: instance => instance.destroy()
}

const { details, edit } = editServices(
  Category,
  {},
  {
    attributes: ['id', 'course_instance_id'],
    saveFields: [
      'eng_name',
      'fin_name',
      'swe_name'
    ],
    valueFields: [
      'id',
      ['lang_name', 'name']
    ]
  }
)

module.exports = {
  getAllCategories,
  getCourseCategories,
  create,
  delete: deleteCategory,
  details,
  edit
}
