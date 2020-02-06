import React, { Component } from 'react';
import './App.css';
import { AgGridReact } from 'ag-grid-react';
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";
import { Container, Row, Col } from 'react-bootstrap';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allColumnDefs: [{
        headerName: "Name", field: "name", resizable: true, checkboxSelection: true
      }, {
        headerName: "YTM(%)", field: "ytm", resizable: true
      }, {
        headerName: "Tenor(Years)", field: "tenor"
      },{
        headerName: "ISIN", field: "isin", resizable: true
      }],
      selectColumnDefs: [{
        headerName: "Name", field: "name", resizable: true, checkboxSelection: true
      }, {
        headerName: "YTM(%)", field: "ytm", resizable: true
      }, {
        headerName: "Tenor(Years)", field: "tenor"
      },{
        headerName: "Allocation(%)", field: "allocation", resizable: true
      },{
        headerName: "ISIN", field: "isin", resizable: true
      }],
      minTenor: 5,
      maxTenor: 10,
      minYTM: 10,
      selectedRowData: [],
      allRowData: [],
    }
  }

  componentDidMount() {
    fetch('http://127.0.0.1:8000/api/bonds?minTenor='+this.state.minTenor+'&maxTenor='+this.state.maxTenor+'&minYTM='+this.state.minYTM)
      .then(result => result.json())
      .then(allRowData => this.setState({allRowData}))
     }
  
  onSelectButtonClick = e => {
    var selectedNodes = this.gridApi.getSelectedNodes()
    var selectedRowData = selectedNodes.map( node => node.data )
    var allRowData = this.state.allRowData.filter(item1 => 
      !selectedRowData.some(item2 => (item2.isin === item1.isin)))

    this.setState({allRowData})

    selectedRowData = this.state.selectedRowData.concat(selectedRowData);
    this.setState({selectedRowData})
  }

  onUnSelectButtonClick = e => {
    const selectedNodes = this.selectedGridApi.getSelectedNodes()
    var selectedData = selectedNodes.map( node => node.data )
    var selectedRowData = this.state.selectedRowData.filter(item1 => 
      !selectedData.some(item2 => (item2.isin === item1.isin)))

    this.setState({selectedRowData})

    var allRowData = this.state.allRowData.concat(selectedData)

    this.setState({allRowData})
  }

  handleChange = e => {
    console.log(e.target.name, e.target.value);
    var minTenor = this.state.minTenor;
    var maxTenor = this.state.maxTenor;
    var minYTM = this.state.minYTM;
    if(e.target.name === 'minTenor'){
      minTenor = e.target.value;
      this.setState({minTenor});
    }else if(e.target.name === 'maxTenor'){
      maxTenor = e.target.value;
      this.setState({maxTenor});
    }else if(e.target.name === 'minYTM'){
      minYTM = e.target.value;
      this.setState({minYTM});
    }
    
    if(minYTM==="") minYTM=0;
    if(maxTenor==="") maxTenor=1000
    if(minTenor==="") minTenor=0

    fetch('http://127.0.0.1:8000/api/bonds?minTenor='+minTenor+'&maxTenor='+maxTenor+'&minYTM='+minYTM)
     .then(result => result.json())
     .then(allRowData => this.setState({allRowData}))
     this.gridApi.autoSizeColumns(['name'])
  }

  onGridReady(params) {
    this.gridApi = params.api;
    console.log(this.gridApi);
    var sort = [
        {
          colId: "ytm",
          sort: "desc"
        }
      ];
      this.gridApi.setSortModel(sort);
  }

  onSelectedGridReady(params) {
    this.selectedGridApi = params.api

    var sort = [
        {
          colId: "ytm",
          sort: "desc"
        }
      ];
      this.selectedGridApi.setSortModel(sort);

  }

  render() {
    return (
      <div
        className="ag-theme-balham"
        style={{
        height: '300px',
        width: '800px' }}>
        
        MinTenor(in years): <input name="minTenor" value={this.state.minTenor} onChange={this.handleChange} />
        MaxTenor(in years): <input name="maxTenor" value={this.state.maxTenor} onChange={this.handleChange} /><br />
        Min YTM(in %): <input name="minYTM" value={this.state.minYTM} onChange={this.handleChange} />
        

        <table><tbody>
        <tr>
          <td>
        <div style={{width:'400px', height:'400px'}}>
        <AgGridReact
          rowSelection="multiple"
          autoSizeColumns="true"
          onGridReady={param => this.gridApi = param.api}
          // onGridReady={param => this.gridApi = param.api}
          columnDefs={this.state.allColumnDefs}
          rowData={this.state.allRowData}>
        </AgGridReact>
        </div>
        </td>
        <td>
          <button onClick={this.onSelectButtonClick}>=></button><br />
          <button onClick={this.onUnSelectButtonClick}>&lt;=</button>  
        </td>
        <td>
        <div style={{width:'400px', height:'400px'}}>
        <AgGridReact
          rowSelection="multiple"
          onGridReady={param => this.selectedGridApi = param.api}
          // onGridReady={this.onSelectedGridReady}
          columnDefs={this.state.selectColumnDefs}
          rowData={this.state.selectedRowData}>
        </AgGridReact>
        </div>
        </td>
        </tr>
        </tbody></table>
      </div>
    );
  }
}

export default App;
