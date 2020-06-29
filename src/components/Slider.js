import React, { useEffect, useState } from "react"
import * as d3 from "d3"
import moment from "moment"

export default function Slider({ year }) {
  const step = 1
  const speed = 250
  const dateFormat = "YYYY"
  const minYearInRange = 1980
  const maxYearInRange = 2019

  const [maxYear, setMaxYear] = useState(year)

  useEffect(() => {
    initialDrawing()
  }, [])
  useEffect(() => {
    moveHandle()
  }, [year])

  function moveHandle() {
    d3.selectAll(".inner-track").attr("x2", xScale(year))
    d3.selectAll(".max-handle").attr("cx", xScale(year))
  }
  function initialDrawing() {
    const svg = d3.select("svg")
    const sliderGroup = svg.append("g").attr("class", "slider-group")
    sliderGroup.append("line").attr("class", "outer-track")
    sliderGroup.append("line").attr("class", "inner-track")
    sliderGroup.append("circle").attr("class", "max-handle")
    sliderGroup.append("text").attr("class", "selected-max-text")
  }

  const xScale = d3
    .scaleLinear()
    .domain([minYearInRange, maxYearInRange])
    .range([0, 200])
    .clamp(true)

  useEffect(() => {
    const rangeValues = d3.range(minYearInRange, maxYearInRange + step, step)

    const grey = "#CCCCCC"
    const purple = "#CAB1D6"

    const svg = d3.select("svg")

    const sliderGroup = svg
      .selectAll(".slider-group")
      .attr("transform", `translate(800,600)`)

    const lineStrokeWidth = 4
    function drawLine(className, x2, color) {
      sliderGroup
        .selectAll(className)
        .attr("x1", xScale(minYearInRange))
        .attr("x2", xScale(x2))
        .attr("stroke", color)
        .attr("stroke-linecap", "round")
        .attr("stroke-width", lineStrokeWidth)
    }

    drawLine(".outer-track", maxYearInRange, grey)
    drawLine(".inner-track", maxYear, purple)

    const drag = d3.drag().on("drag", function () {
      dragHandle(d3.select(this))
    })

    function drawHandle(minMax, xVal) {
      const handleRadius = 8
      sliderGroup
        .selectAll(`.${minMax}-handle`)
        .attr("cx", xScale(xVal))
        .attr("cursor", "pointer")
        .attr("fill", purple)
        .attr("r", handleRadius)
        .call(s => drag(s))
    }

    drawHandle("max", maxYear)

    const fontSize = 18
    const padding = 7
    const lineHeight = fontSize + padding + lineStrokeWidth
    function drawText(className, x, y, textAnchor, textString) {
      const textOpacity = 0.7
      sliderGroup
        .selectAll(className)
        .attr("x", x)
        .attr("y", y)
        .style("text-anchor", textAnchor)
        .text(textString)
        .attr("opacity", textOpacity)
        .attr("font-size", fontSize)
    }

    drawText(
      ".selected-max-text",
      xScale(maxYear),
      -lineHeight,
      "middle",
      maxYear
    )

    function dragHandle(selection) {
      const handleClass = selection.attr("class")
      const minOrMax = handleClass.split("-")[0]
      const oldXCoordinate = d3.event.x

      const oldDateVal = xScale.invert(oldXCoordinate)
      const indexOfNewVal = rangeValues.findIndex(val => {
        const bottomMidPoint = val - step / 2
        const topMidPoint = val + step / 2
        return bottomMidPoint < oldDateVal && oldDateVal < topMidPoint
      })
      const newDateVal = rangeValues[indexOfNewVal]

      function interpolateX(selection, xAttr) {
        const newXCoordinate = xScale(rangeValues[indexOfNewVal])
        selection
          .transition()
          .duration(speed)
          .attrTween(xAttr, () =>
            d3.interpolate(oldXCoordinate, newXCoordinate)
          )
      }

      function updateVisual(x) {
        const innerTrack = d3.selectAll(".inner-track")
        const handle = d3.selectAll(`.${minOrMax}-handle`)
        const text = d3.selectAll(`.selected-${minOrMax}-text`)
        interpolateX(handle, "cx")
        interpolateX(text, "x")
        interpolateX(innerTrack, x)
      }

      setMaxYear(newDateVal)
      updateVisual("x2")
    }
  }, [maxYear, maxYearInRange, minYearInRange, speed, step, xScale])

  return null
}
