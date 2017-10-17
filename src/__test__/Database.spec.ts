import test from 'ava'
import getters from '../modules/rootGetters'
import actions from '../modules/rootActions'
import mutations from '../modules/mutations'
import subActions from '../modules/subActions'
import subGetters from '../modules/subGetters'
import Model from '../Model'
import Database from '../Database'

class User extends Model {
  static entity = 'users'
}

class Post extends Model {
  static entity = 'posts'
}

const users = { actions: {} }
const posts = { mutations: {} }

test('Database can register models', (t) => {
  const database = new Database()

  const expected = [
    { model: User, module: users },
    { model: Post, module: posts }
  ]

  database.register(User, users)
  database.register(Post, posts)

  t.deepEqual<any>(database.entities, expected)
})

test('Database can generate Vuex Module Tree from registered entities', (t) => {
  const database = new Database()

  database.register(User, users)
  database.register(Post, posts)

  const expected = {
    namespaced: true,
    state: { name: 'entities' },
    getters,
    actions,
    mutations,

    modules: {
      users: {
        namespaced: true,
        state: { $connection: 'entities', $name: 'users', data: {} },
        getters: subGetters,
        actions: subActions,
        mutations: {}
      },
      posts: {
        namespaced: true,
        state: { $connection: 'entities', $name: 'posts', data: {} },
        getters: subGetters,
        actions: subActions,
        mutations: {}
      }
    }
  }

  t.deepEqual<any>(database.modules('entities'), expected)
})
