import React, { useState, useEffect } from "react"
import styled from "styled-components"
import * as d3 from "d3"
import data from "../data/mapEuropeWithElectionData"
import Slider from "./Slider"
import pause from '../assets/pause.png'
import play from '../assets/play.svg'
import restart from '../assets/restart.png'

export default function NationalPopulism() {
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(true)

  useEffect(() => {
    mountD3Map()
  }, [])

  useEffect(() => {
    if(!playing) return
    if (index >= 39) return
    let id = setTimeout(() => {
      setIndex(index + 1)
    }, 300)
    return () => clearTimeout(id)
  })

  useEffect(() => {
    reColourMap(index)
    updateTooltip()
  }, [index])

  function reColourMap(index) {
    d3.selectAll("path").attr("fill", country => {
      const value =
        country.properties.electionData &&
        country.properties.electionData[index].value
      const noDataForCountry = !value
      const noDataForYear = value === "x"
      const transparent = noDataForCountry || noDataForYear
      if (transparent) return "transparent"
      const shadeOfGreen = d3.interpolateReds(value / 100)
      return shadeOfGreen
    })
  }

  function mountD3Map() {
    const isDesktop = window.innerWidth > 500
    const scale = isDesktop ? 1500 / Math.PI / 2 : 700 / Math.PI / 2
    const translate = isDesktop ? [580, 450] : [350, 250]
    const projection = d3.geoMercator().scale(scale).translate(translate)

    const svg = d3.select("svg")

    const countryGroups = svg
      .selectAll(".country-groups")
      .data(data.features)
      .enter()
      .append("g")
      .attr("class", "country-groups")

    countryGroups
      .append("path")
      .attr("d", d3.geoPath(projection))
      .attr("stroke-width", "1px")
      .attr("stroke-opacity", 0.1)
      .attr("opacity", 0.7)
      .attr("stroke", "steelblue")
      .attr("transform", `scale(2) translate(-300, 0)`)

    const tooltipGroups = svg
      .selectAll(".tooltip-groups")
      .data(data.features)
      .enter()
      .append("g")
      .attr("class", d => `tooltip-${d.properties.postal}`)
      .style("visibility", "hidden")

    tooltipGroups
      .append("rect")
      .attr("class", "tooltip-rect")
      .attr("width", 300)
      .attr("height", 60)
      .attr("fill", "white")

    tooltipGroups
      .append("text")
      .attr("class", "tooltip-text-l1")
      .attr("x", 10)
      .attr("y", 20)
      .attr("font-family", "Major Mono")
    tooltipGroups
      .append("text")
      .attr("class", "tooltip-text-l2")
      .attr("x", 10)
      .attr("y", 40)
      .attr("font-family", "Major Mono")
  }

  function updateTooltip() {
    const tooltipPadding = 10
    const countryGroups = d3.selectAll(".country-groups")

    d3.selectAll(".tooltip-text-l1").text(d => {
      if (d.properties.electionData) {
        return `${d.properties.name_long}: ${d.properties.electionData[index].value}% `
      } else {
        return `${d.properties.name_long}`
      }
    })
    d3.selectAll(".tooltip-text-l2").text(d => {
      return `(${1980 + index})`
    })

    function positionTooltip(id) {
      d3.select(`.tooltip-${id}`)
        .style("visibility", "visible")
        .attr(
          "transform",
          `translate(${d3.event.offsetX + tooltipPadding},${d3.event.offsetY})`
        )
    }

    countryGroups
      .on("mouseover", function (d) {
        positionTooltip(d.properties.postal)
      })
      .on("mousemove", d => {
        positionTooltip(d.properties.postal)
      })
      .on("mouseout", d =>
        d3
          .select(`.tooltip-${d.properties.postal}`)
          .style("visibility", "hidden")
      )
  }

  function handleRestart () {
setPlaying(true)
setIndex(0)
  }
  const atEnd = index=== 39
  const buttonIcon = playing?  pause : play
  return (
    <MapWrapper>
      <InfoBox>
        <Year>{1980 + index}</Year>

        <Description>
          The darker the red color of the country, the higher percentage of
          voters voted for national populism party that year. data from{" "}
          <a href="https://populismindex.com/data/">
            Timbro authoritarian populism index
          </a>{" "}
        </Description>
        <Slider year={index + 1980} playing={playing}/>

        {atEnd ? <Img src={restart} onClick={handleRestart}/> :
        <Img onClick={()=> setPlaying(!playing)} src={buttonIcon}/>
        }

      </InfoBox>
      <SvgStyled />
    </MapWrapper>
  )
}

const Img = styled.img`
position:absolute;
right: 370px;
top: 350px;
height: 15px;
width: 15px;
background: none;
font-family: Major Mono;
outline: none;
cursor: pointer;
`
const SvgStyled = styled.svg`
  height: 900px;
  width: 1400px;
  @media (max-width: 500px) {
    width: 300px;
  }
`

const MapWrapper = styled.div`
  height: 800px;
  overflow: hidden;
  padding: 10px;
  position: absolute;
  top: 100px;
`
const InfoBox = styled.div`
  position: absolute;
  right: 50px;
  top: 250px;
  width: 400px;
  @media (max-width: 500px) {
    width: 250px;
    top: 400px;
  }
`
const Year = styled.h1`
  font-family: Major Mono;
  font-size: 60px;
  color: grey;
  margin: 20px 0;

  @media (max-width: 500px) {
    font-size: 40px;
  }
`
const Description = styled.p`
  font-family: Major Mono;
  font-size: 20px;
  color: grey;
  line-height: 24px;
  @media (max-width: 500px) {
    font-size: 12px;
  }
`
