/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React, { useState } from "react"
import PropTypes from "prop-types"
import { useStaticQuery, graphql } from "gatsby"
import styled from "styled-components"
import * as syllable from "syllable"

import "./layout.css"

export const Line = ({ lineNumber, setLinesArr, linesArr, index }) => {
  const [lineVal, setLineVal] = useState("")

  function handleChange(e) {
    setLineVal(e.target.value)
    const newArr = [...linesArr]
    newArr[index] = e.target.value
    setLinesArr(newArr)
  }

  return (
    <Container>
      <PStyledRight>{lineNumber}</PStyledRight>
      <Input value={lineVal} onChange={handleChange} />
      <PStyledLeft>{syllable(lineVal)}</PStyledLeft>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
`

const PStyled = styled.p`
  font-family: Major Mono;
  width: 30px;
  margin: 0 20px;
  margin-top: 5px;
  /* padding: 10px; */
`
const PStyledRight = styled(PStyled)`
  text-align: right;
`
const PStyledLeft = styled(PStyled)`
  text-align: left;
`
const Input = styled.input`
  width: 550px;
  height: 40px;
  border: none;
  border-bottom: 1px solid coral;
  font-family: Major Mono;
  outline: none;
  padding: 10px;
  font-size: 12px;
  @media only screen and (max-width: 600px) {
    width: 90%;
  }
`
