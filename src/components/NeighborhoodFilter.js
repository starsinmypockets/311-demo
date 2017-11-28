import React, { Component } from 'react'
import BaseFilter from './BaseFilter'
import {GeoJSON} from 'react-leaflet'
import { Map, Circle, Marker, Popup, TileLayer, ZoomControl } from 'react-leaflet'
import phillyHoodsGeoJson from '../lib/Neighborhoods_Philadelphia.json'
import FontAwesome from 'react-fontawesome'

// @@TODO put all this stuff 
// somewhere sensible
const SELECTED_FILL_COLOR = "red"
const SELECTED_FILL_OPACITY = .65
const UNSELECTED_FILL_COLOR = "purple"
const UNSELECTED_FILL_OPACITY = .65
const TILE_URL = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png'
const TILE_ATTR = '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
const MAP_CENTER = [39.9528, -75.1638]
const ZOOM_LEVEL = 12
const mapOpts = { 
  center: MAP_CENTER,
  zoomControl: false,
  zoom: ZOOM_LEVEL, 
  maxZoom: 19, 
  minZoom: 11, 
  scrollWheelZoom: false,
  legends: true,
  infoControl: false,
  attributionControl: true
}

export default class NeighborhoodFilter extends BaseFilter {
  componentWillMount() {
    this.setState({selected: this.props.params[this.props.filterKey] || []})
  }
  
  unzoom() {
    this.setState({zoom: ZOOM_LEVEL, mapCenter: MAP_CENTER})
    this.render()
  }

  onEachFeature(feature, layer) {
    const vals = this.state.selected
    
    if (vals.indexOf(feature.properties.name) >= 0) {
      feature.properties.selected = true
    } else {
      feature.properties.selected = false
    }
    
    this.layer = layer
    layer.on({
      click: this.handleOnChange.bind(this)
    })
  }

  handleOnChange(e) {
    let vals = this.state.selected
    const clicked = e.target.feature.properties.name
    const deselect = e.target.feature.properties.selected
    
    if (deselect) {
      console.log("DESELECT", clicked, vals, vals[clicked])
      // update feature in dom so it gets restyled
//      e.target.feature.properties.selected = false
      // remove feature name from url parameters
      const index = vals.indexOf(clicked)
      vals = vals.filter(val => val !== clicked)
    } else {
      vals.push(clicked)
    }

//    e.target.options.onEachFeature(e.target.feature, this.layer)
    
//    this.updateStyle(e.target.feature)

    console.log('DDD', vals)
    this.setState({selected: vals})
    this.doOnChange(vals.map(item => {
      return {value: item}
    }))

  }

  updateStyle(feature) {
    console.log("UDS")
    
    if (feature.properties.selected === true) {
      return {
        fillColor: SELECTED_FILL_COLOR,
        fillOpacity: SELECTED_FILL_OPACITY
      }
    } else {
      return {
        fillColor: UNSELECTED_FILL_COLOR,
        fillOpacity: UNSELECTED_FILL_OPACITY
      }
    }
  } 
	
  render(){
    const geoid = this.state.selected.join('_')
    const _mapOpts = Object.assign(mapOpts, {zoom: this.state.zoomLevel || ZOOM_LEVEL, center: this.state.center || MAP_CENTER})
    console.log("GEOID", geoid)
    console.log(_mapOpts)
    return (
    <div id="map-container">
      <FontAwesome name="crosshairs" size="2x" onClick={this.unzoom.bind(this)}/>
      <Map {..._mapOpts}>
        <TileLayer
          attribution={TILE_ATTR}
          url={TILE_URL}
        />
        <GeoJSON
          data={phillyHoodsGeoJson}
          key={geoid}
          className="neighborhoods_path"
          onEachFeature={this.onEachFeature.bind(this)}
          style={this.updateStyle}
        />
        <ZoomControl />
      </Map>
    </div>
    )
  }
}
