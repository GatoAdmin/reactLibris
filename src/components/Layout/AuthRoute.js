import React from "react"
import { Route, Redirect } from "react-router-dom"

function AuthRoute({ currentUser, component: Component, render, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) =>
        typeof(currentUser) == 'object'&&!Array.isArray(currentUser) ? (
          render ? (
            render(props)
          ) : (
            <Component {...props} />
          )
        ) : (
          <Redirect
            to={{ pathname: "/login", state: { from: props.location } }}
          />
        )
      }
    />
  )
}

export default AuthRoute