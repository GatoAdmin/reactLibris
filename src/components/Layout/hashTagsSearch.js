import _ from 'lodash'
import axios from 'axios';
import React from 'react'
import { Search, Grid, Form, Header, Segment, Label, Button } from 'semantic-ui-react'

// const source = _.times(5, () => ({
//   title: faker.company.companyName(),
//   description: faker.company.catchPhrase(),
//   image: faker.internet.avatar(),
//   price: faker.finance.amount(0, 100, 2, '$'),
// }))

const initialState = {
  loading: false,
  results: [],
  value: '',
}
var source;
function getHashTags(props){
    let hashTags = props.tags;//TODO:웹브라우저 캐싱 후 가져오는 것으로 바꿀것
    let getTags = ()=>{
      axios.post('/hashTags')
      .then(res =>{
        source = res.data.hashTag
      } )
      .catch(function (err) {
          console.log(err);
      });
    }
    if(hashTags === null|| hashTags === undefined){
      getTags();
    }    
    return hashTags;
}

function exampleReducer(state, action) {
  switch (action.type) {
    case 'CLEAN_QUERY':
      return initialState
    case 'START_SEARCH':
      return { ...state, loading: true, value: action.query }
    case 'FINISH_SEARCH':
      return { ...state, loading: false, results: action.results }
    case 'UPDATE_SELECTION':
      return { ...state, value: action.selection }

    default:
      throw new Error()
  }
}

const resultRenderer = ({ name }) => <Label content={name} />

function SearchInput(props) {
  source = getHashTags(props);
  const [state, dispatch] = React.useReducer(exampleReducer, initialState)
  const { loading, results, value } = state
  const timeoutRef = React.useRef()
  const handleSearchChange = React.useCallback((e, data) => {
    clearTimeout(timeoutRef.current)
    dispatch({ type: 'START_SEARCH', query: data.value })
    props.onChangeHashTags(e.target.value);
    timeoutRef.current = setTimeout(() => {
      if (data.value.length === 0) {
        dispatch({ type: 'CLEAN_QUERY' })
        return
      }

      const re = new RegExp(_.escapeRegExp(data.value), 'i')
      const isMatch = (result) => re.test(result.name)

      dispatch({
        type: 'FINISH_SEARCH',
        results: _.filter(source, isMatch),
      })
    }, 300)
  }, [])
  React.useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current)
    }
  }, [])

  return (
          <Grid>
           <Grid.Column width={11}>
            <Search
              input={{ icon:null, name:'filter_hash_tags', label:'태그' }}
              loading={loading}
              onResultSelect={(e, data) =>
                dispatch({ type: 'UPDATE_SELECTION', selection: data.result.name })
              }
              onSearchChange={handleSearchChange}
              resultRenderer={resultRenderer}
              results={results}
              value={value}
            />
          </Grid.Column>
          </Grid>
  )
}

export default SearchInput