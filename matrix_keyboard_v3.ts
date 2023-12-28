//% block="Emakefun"
namespace Emakefun {

  /** Default I2C address */
  const DEFAULT_I2C_ADDRESS: number = 0x65

  /**
   * Enum for matrix keyboard keys.
   */
  export enum MatrixKeyboardKey {
    KEY_0 = 1 << 7,
    KEY_1 = 1 << 0,
    KEY_2 = 1 << 4,
    KEY_3 = 1 << 8,
    KEY_4 = 1 << 1,
    KEY_5 = 1 << 5,
    KEY_6 = 1 << 9,
    KEY_7 = 1 << 2,
    KEY_8 = 1 << 6,
    KEY_9 = 1 << 10,
    KEY_A = 1 << 12,
    KEY_B = 1 << 13,
    KEY_C = 1 << 14,
    KEY_D = 1 << 15,
    KEY_ASTERISK = 1 << 3,
    KEY_NUMBER_SIGN = 1 << 11,
  }

  export class MatrixKeyboard {
    // I2C address
    private readonly i2c_address: number = undefined;

    // Last key states
    private last_key_states: number = 0;

    private key_states: number = 0;

    /**
     * Constructor.
     *
     * @param i2c_address I2C address
     */
    constructor(i2c_address: number = DEFAULT_I2C_ADDRESS) {
      // Initialize I2C device
      this.i2c_address = i2c_address
    }

    /**
     * Check if key is clicked.
     *
     * @param key The key
     * @return Clicked or not
     */
    //% block="$this is clicked $key"
    //% subcategory="MatrixKeyboard"
    //% this.defl=matrix_keyboard
    //% key.defl=KEY_1
    isClicked(key: MatrixKeyboardKey): boolean {
      return (this.last_key_states & key) == 0 && (this.key_states & key) != 0;
    }

    //% block="$this update"
    //% subcategory="MatrixKeyboard"
    //% this.defl=matrix_keyboard
    update() {
      let key_states = -1
      while (key_states == -1) {
        key_states = pins.i2cReadBuffer(this.i2c_address, 2).getNumber(NumberFormat.Int16LE, 0);
        let count = 4;
        while (count-- > 0) {
          if (key_states != pins.i2cReadBuffer(this.i2c_address, 2).getNumber(NumberFormat.Int16LE, 0)) {
            key_states = -1;
            break;
          }
        }
      }

      this.last_key_states = this.key_states;
      this.key_states = key_states;
    }
  }

  /**
   * Create matrix keyboard object.
   *
   * @param i2c_address I2C address, default 0x50
   */
  //% block="create matrix keyboard|I2C address = $i2c_address"
  //% subcategory="MatrixKeyboard"
  //% blockSetVariable=matrix_keyboard
  //% i2c_address.defl=0x65
  //% weight=100
  //% inlineInputMode=external
  export function createMatrixKeyboard(i2c_address: number = DEFAULT_I2C_ADDRESS): MatrixKeyboard {
    return new MatrixKeyboard(i2c_address);
  }
}