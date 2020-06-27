import React from "react"
import styled from "styled-components"
import NationalPopulism from "../components/MapNationalPopulism"
import "../index.css"
export default function ArticleTwo() {
  return (
    <Container>
      <ArticleTitle>Rise of National Populism in Europe</ArticleTitle>
      <NationalPopulism />
    </Container>
  )
}

const ArticleTitle = styled.h1`
  width: 20%;
  margin-top: 0;
  padding-top: 20px;
  margin-left: 10px;
  font-size: 30px;
  color: #ff5c00;
  text-transform: uppercase;
  line-height: 42px;
  font-family: Major Mono;
`
const Container = styled.div`
  position: relative;
  background: #efe5db;
  height: 100vh;
`
