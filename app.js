const APP_NAME = "Image Instrctor"
const SN_DATA = "DATA"
const SN_INSPECT = "INSPECT"
const SN_RESULTS = "RESULTS"

const PASS = "PASS"
const FAIL = "FAIL"
const ERROR = "ERROR"

const HEADERS = ["URL", "STATUS", "TIMESTAMP"]

class App {
    constructor() {
        this.ss = SpreadsheetApp.getActive()
        this.wsData = this.ss.getSheetByName(SN_DATA)
        this.wsApp = this.ss.getSheetByName(SN_INSPECT)
        this.wsResults = this.ss.getSheetByName(SN_RESULTS) || this.ss.insertSheet(SN_RESULTS)
    }

    reset() {
        const values = this.wsData.getDataRange().getValues()
        const index = values.findIndex(([url, status]) => status.toString().trim() === "")
        if (index !== -1) {
            const [url, status] = values[index]
            this.wsApp.getRange("B2:C2").setValues([[index + 1, url]])
        } else {
            this.ss.toast("No more images to be inspected.", APP_NAME)
        }
    }

    getRow() {
        return { row: this.wsApp.getRange("B2").getValue(), url: this.wsApp.getRange("C2").getValue() }
    }

    addRecord(record) {
        this.wsResults.getRange(1, 1, 1, 3).setValues([HEADERS])
        this.wsResults.appendRow(record)
    }

    pass() {
        const { row, url } = this.getRow()
        this.addRecord([url, PASS, new Date()])
        this.wsData.getRange(`B${row}`).setValue(PASS)
        this.ss.toast(PASS, APP_NAME)
        reset()
    }

    fail() {
        const { row, url } = this.getRow()
        this.addRecord([url, FAIL, new Date()])
        this.wsData.getRange(`B${row}`).setValue(FAIL)
        this.ss.toast(FAIL, APP_NAME)
        reset()
    }

    error() {
        const { row, url } = this.getRow()
        this.addRecord([url, ERROR, new Date()])
        this.wsData.getRange(`B${row}`).setValue(ERROR)
        this.ss.toast(ERROR, APP_NAME)
        reset()
    }
}

function reset() {
    const app = new App()
    app.reset()
}

function pass() {
    const app = new App()
    app.pass()
}

function fail() {
    const app = new App()
    app.fail()
}

function error() {
    const app = new App()
    app.error()
}

function onOpen() {
    SpreadsheetApp.getUi().createMenu(APP_NAME).addItem("Reset", "reset").addToUi()
}
