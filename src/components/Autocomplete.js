import React, { Component } from 'react'
import BaseFilter from './BaseFilter'
import ReactSelect from './ReactSelect'
import { omit } from 'lodash'
import cx from 'classnames/bind'

export default class Autocomplete extends BaseFilter {
  render(){
    let props = this.props
    let val = this.getFilterValue() || ''
    let label = props.label || 'Filter Label'
    let labelClass = (props.label) ? '' : 'sr-only'
    let { className } = this.props
    let inputProps = {}

    return (
      <div className={cx('autocomplete-filter-container', className)}>
        <label htmlFor={this.props.key} className={labelClass}>Filter Label</label>
        <ReactSelect value={val} disabled={this.isDisabled()} {...props} onChange={this.onChange.bind(this)} key={this.props.key} inputProps={inputProps} />
      </div>
    )
  }
}
