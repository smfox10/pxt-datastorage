/**
 * eeprom block
 */
//% weight=100 color=#303030 icon="\uf2db"

namespace eeprom {
    const EEPROM_ADDRESS = 0x50;
    const PAGE_SIZE = 8; // EEPROM page size is 8 bytes

    //% block="Store value %value"
    export function storeValue(value: number): void {
        let startAddr = 0x00;
        // Check if the address spans across pages
        if ((startAddr % PAGE_SIZE) + 4 > PAGE_SIZE) {
            // Handle page-crossing write (simple error reporting in this example)
            console.error("Write address spans across pages!");
            return;
        }
        let buf = pins.createBuffer(5);
        buf[0] = startAddr; // 8-bit address
        buf.setNumber(NumberFormat.UInt32BE, 1, value); // Write in big-endian format
        pins.i2cWriteBuffer(EEPROM_ADDRESS, buf);
        control.waitMicros(5000); // Wait for the write operation to complete
    }

    //% block="Read value"
    export function readValue(): number {
        let startAddr = 0x00;
        pins.i2cWriteNumber(EEPROM_ADDRESS, startAddr, NumberFormat.UInt8BE);
        let data = pins.i2cReadBuffer(EEPROM_ADDRESS, 4);
        return data.getNumber(NumberFormat.UInt32BE, 0);
    }
}