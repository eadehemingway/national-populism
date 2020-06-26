import React, { useState } from "react"

import styled from "styled-components"
import { useEffect } from "react"
import { Line } from "../components/Line"
import "../index.css"

const IndexPage = () => {
  const [lines, setLines] = useState()
  const [linesArr, setLinesArr] = useState([])

  function handleInputChange(e) {
    const numLines = Number(e.target.value)

    setLines(numLines)
  }
  useEffect(() => {
    if (!lines) return
    const arr = new Array(lines).fill("")

    setLinesArr(arr)
  }, [lines])

  const copyToClipboard = () => {
    const el = document.createElement("textarea")
    const str = linesArr.join("\r\n")
    el.value = str
    document.body.appendChild(el)
    el.select()
    document.execCommand("copy")
    document.body.removeChild(el)
  }

  return (
    <Container>
      <Header>
        <PStyled>lines:</PStyled>
        <Input
          placeholder={0}
          type="text"
          onChange={handleInputChange}
          defaultValue={lines}
        />
        <StyledBtn onClick={copyToClipboard}>Copy</StyledBtn>
      </Header>
      {linesArr.map((l, i) => {
        return (
          <Line
            key={i}
            index={i}
            lineNumber={i + 1}
            setLinesArr={setLinesArr}
            linesArr={linesArr}
          />
        )
      })}
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const PStyled = styled.p`
  font-family: Major Mono;
  margin-right: 30px;
`
const Header = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 60px;
  margin-top: 100px;
`
const Input = styled.input`
  width: 60px;
  height: 30px;
  border: 1px solid coral;
  text-align: center;
  font-family: Major Mono;
  outline: none;
`

const StyledBtn = styled.button`
  background: coral;
  color: white;
  border: 1px solid coral;
  margin-left: 20px;
  height: 30px;
  font-family: Major Mono;
  font-size: 14px;
  cursor: pointer;
  outline: none;
  border-radius: 2px;
  right: 100px;
`

export default IndexPage
