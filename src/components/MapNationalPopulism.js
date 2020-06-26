import React, { useState, useEffect, useRef } from "react"
import styled from "styled-components"
import * as d3 from "d3"
import data from "../data/mapEuropeWithElectionData"

export default function NationalPopulism() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    mountD3Map()
  }, [])

  useEffect(() => {
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
    const projection = d3
      .geoMercator()
      .scale(1500 / Math.PI / 2)
      .translate([580, 450])

    const svg = d3.select("#map").attr("width", 1400).attr("height", 900)

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
      .attr("class", "tooltip-groups")
      .attr("class", d => `tooltip-${d.properties.name_long}`)
      .style("visibility", "hidden")

    tooltipGroups
      .append("rect")
      .attr("class", "tooltip-rect")
      .attr("width", 200)
      .attr("height", 60)
      .attr("fill", "white")

    tooltipGroups
      .append("text")
      .attr("class", "tooltip-text")
      .attr("x", 10)
      .attr("y", 20)
      .attr("font-family", "Major Mono")
  }

  function updateTooltip() {
    const tooltipPadding = 10
    const countryGroups = d3.selectAll(".country-groups")

    d3.selectAll(".tooltip-text").text(d => {
      if (d.properties.electionData) {
        return `${d.properties.name_long}: ${d.properties.electionData[index].value}`
      } else {
        return `${d.properties.name_long}`
      }
    })

    countryGroups
      .on("mouseover", function (d) {
        d3.select(`.tooltip-${d.properties.name_long}`)
          .style("visibility", "visible")
          .attr(
            "transform",
            `translate(${d3.event.offsetX + tooltipPadding},${
              d3.event.offsetY
            })`
          )
      })
      .on("mousemove", d => {
        d3.select(`.tooltip-${d.properties.name_long}`).attr(
          "transform",
          `translate(${d3.event.offsetX + tooltipPadding},${d3.event.offsetY})`
        )
      })
      .on("mouseout", d =>
        d3
          .select(`.tooltip-${d.properties.name_long}`)
          .style("visibility", "hidden")
      )
  }
  return (
    <MapWrapper>
      <Year>{1980 + index}</Year>
      <svg id="map" />
    </MapWrapper>
  )
}

const MapWrapper = styled.div`
  height: 800px;
  overflow: hidden;
  padding: 10px;
  position: absolute;
  top: 100px;
`
const Year = styled.h1`
  font-family: Major Mono;
  position: absolute;
  right: 50px;
  top: 450px;
  font-size: 100px;
  color: grey;
`
