const JSON_DATA =
{
    "availability":
        [
            {
                "company_name": "ACME",
                "device_type": 1,
                "device_id": "47AAK",
                "battery_level": 74,
                "location": { "type": "Point", "coordinates": [-97.749081, 30.265518] },
                "is_reserved": false,
                "is_disabled": false
            },
            {
                "company_name": "ACME",
                "device_type": 1,
                "device_id": "H1E2C",
                "battery_level": 63,
                "location": { "type": "Point", "coordinates": [-97.738109, 30.265582] },
                "is_reserved": false,
                "is_disabled": false
            },
            {
                "company_name": "Name Test",
                "device_type": "Type Test",
                "device_id": "ID Test",
                "battery_level": "Level Test",
                "location": { "type": "Point", "coordinates": ["Lat Test", "Lng Test"] },
                "is_reserved": "is reserved test",
                "is_disabled": "is disabled test"
            }
        ]
}

function getDevices(data = JSON_DATA) {
    const id = "1J1E61NNnWKZA6QGi2uytvjAHhdXXlAlJa38IFCncAPM" // sample spreadsheet id
    const ws = SpreadsheetApp.openById(id).getActiveSheet()
    const dataRange = ws.getDataRange()
    const values = dataRange.getDisplayValues()
    const allRecords = data.availability
    values.forEach((v, i) => {
        const id = v[0].trim()
        if (id && i > 0) {
            const record = allRecords.find(item => item["device_id"] === id)
            if (record) {
                const companyName = record["company_name"]
                const deviceType = record["device_type"]
                const batteryLevel = record["battery_level"]
                const isReserved = record["is_reserved"]
                const isDisabled = record["is_disabled"]
                let lat = null
                let long = null
                const location = record["location"]
                if (location) {
                    const coordinates = location["coordinates"]
                    if (coordinates) [lat, long] = coordinates
                }
                values[i] = [...v.slice(0, 2), companyName, deviceType, id, batteryLevel, lat, long, isReserved, isDisabled]
            }
        }
    })
    dataRange.setValues(values)
}
