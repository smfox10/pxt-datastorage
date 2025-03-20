/**
 * EEPROM AT24C02 Block
 */
//% weight=100 color=#303030 icon="\uf2db"
namespace eeprom {
    const EEPROM_ADDRESS = 0x50;
    const PAGE_SIZE = 8; // EEPROM 页大小为 8 字节

    /**
     * 存储一个双精度浮点数
     * @param value 要存储的浮点数
     */
    //% block="Store float value %value"
    export function storeFloat(value: number): void {
        let startAddr = 0x00;
        // 创建9字节缓冲区：1字节地址 + 8字节双精度数据
        let buf = pins.createBuffer(9);
        buf[0] = startAddr;
        // 将双精度浮点数以大端格式写入缓冲区，从索引1开始
        buf.setNumber(NumberFormat.Float64BE, 1, value);
        // 写入数据到EEPROM
        pins.i2cWriteBuffer(EEPROM_ADDRESS, buf);
        // 等待写入完成（AT24C02最长需要5ms）
        control.waitMicros(5000);
    }

    /**
     * 读取一个双精度浮点数
     */
    //% block="Read float value"
    export function readFloat(): number {
        let startAddr = 0x00;
        // 发送要读取的起始地址
        pins.i2cWriteNumber(EEPROM_ADDRESS, startAddr, NumberFormat.UInt8BE);
        // 从EEPROM读取8字节数据
        let data = pins.i2cReadBuffer(EEPROM_ADDRESS, 8);
        // 将数据解析为双精度浮点数
        return data.getNumber(NumberFormat.Float64BE, 0);
    }
}