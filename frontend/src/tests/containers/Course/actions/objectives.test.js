import { addObjective, removeObjective } from '../../../../containers/Course/actions/objectives'
import { testService } from '../../../testUtils'

testService({
  func: addObjective,
  type: {
    success: 'OBJECTIVE_CREATE'
  },
  data: {
    eng_name: 'doot',
    fin_name: 'dööt',
    swe_name: 'dååt',
    skill_level_id: 3,
    category_id: 7,
    course_instance_id: 1
  },
  apiRoute: '/objectives/create',
  apiMethod: 'post'
})

testService({
  func: removeObjective,
  type: {
    success: 'OBJECTIVE_DELETE'
  },
  data: {
    id: 15
  },
  apiRoute: '/objectives/15',
  apiMethod: 'delete'
})
