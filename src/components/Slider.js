import React, { useEffect, useState } from "react"
import * as d3 from "d3"

export default function Slider({ year, playing }) {
  const [maxYear, setMaxYear] = useState(year)
  const step = 1
  const speed = 250

  const minYearInRange = 1980
  const maxYearInRange = 2019


  useEffect(() => {
    initialDrawing()
  }, [])

  useEffect(() => {
    moveHandle()
  }, [year])

  function moveHandle() {
    d3.selectAll(".inner-track").attr("x2", xScale(year))
    d3.selectAll(".max-handle").attr("x", xScale(year))

  }

  function initialDrawing() {
    const svg = d3.select("svg")
    const sliderGroup = svg.append("g").attr("class", "slider-group").attr("transform", `translate(1020,600)`)
    sliderGroup.append("line").attr("class", "outer-track")
    sliderGroup.append("line").attr("class", "inner-track")
    sliderGroup.append("rect").attr("class", "max-handle")

    const rangeValues = d3.range(minYearInRange, maxYearInRange + step, step)

    const grey = "#CCCCCC"
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
    drawLine(".inner-track", maxYear, 'coral')

    const drag = d3.drag().on("drag", function () {
      dragHandle(d3.select(this))
    })


      const handleRadius = 8
      sliderGroup
        .selectAll(`.max-handle`)
        .attr("x", xScale(maxYear))
        .attr("y", - handleRadius)
        .attr("cursor", "pointer")
        .attr("fill", 'coral')
        .attr("width", handleRadius)
        .attr("height", handleRadius * 2)
        .call(s => drag(s))




    function dragHandle() {


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


      setMaxYear(newDateVal)
      const innerTrack = d3.selectAll(".inner-track")
      const handle = d3.selectAll(`.max-handle`)

      interpolateX(handle, "x")
      interpolateX(innerTrack, 'x2')
  }
  }
  const xScale = d3
    .scaleLinear()
    .domain([minYearInRange, maxYearInRange])
    .range([0, 300])
    .clamp(true)


  return null
}
