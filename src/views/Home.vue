<template>
  <q-page class="home q-pt-lg" padding>
    <q-form class="q-gutter-md">
      <!-- <q-input
        filled
        v-model="name"
        label="Your name *"
        hint="Name and surname"
        lazy-rules
        :rules="[ val => val && val.length > 0 || 'Please type something']"
      />-->
      <div class="row">
        <div class="col col-auto flex q-mr-md">
          <q-card class="my-card">
            <q-card-section>
              <p class="text-h6">CPU</p>
              <div class="flex">
                <div>
                  <div class="flex column">
                    <q-input
                      class="q-mb-md input-8-bit r1"
                      standout="bg-grey-1"
                      :label="'Register 1 (\u2082)'"
                      stack-label
                      readonly
                      v-model="r1"
                    />
                    <q-input
                      class="q-mb-md input-8-bit r2"
                      standout="bg-grey-1"
                      :label="'Register 2 (\u2082)'"
                      stack-label
                      readonly
                      v-model="r2"
                    />
                    <q-input
                      class="q-mb-md input-8-bit r3"
                      standout="bg-grey-1"
                      :label="'Register 3 (\u2082)'"
                      stack-label
                      readonly
                      v-model="r3"
                    />
                  </div>
                </div>
                <div class="q-ml-md">
                  <div class="flex column">
                    <q-input
                      class="q-mb-md input-8-bit ir"
                      standout="bg-grey-1"
                      :label="'IR (\u2082)'"
                      stack-label
                      readonly
                      v-model="ir"
                    />
                    <q-input
                      class="q-mb-md input-8-bit flag"
                      standout="bg-grey-1"
                      :label="'Flag (\u2082)'"
                      stack-label
                      readonly
                      v-model="flag"
                    />
                    <q-input
                      class="q-mb-md pc"
                      standout="bg-grey-1"
                      :label="'Program Counter (\u2082)'"
                      stack-label
                      readonly
                      v-model="pc"
                    />
                  </div>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <div class="col">
          <q-table
            hide-bottom
            title="Memory"
            :data="memory"
            :columns="columns"
            :pagination.sync="pagination"
            row-key="value"
          >
            <template v-slot:body="props">
              <q-tr :props="props">
                <q-td :id="props.row.value" key="value" :props="props">
                  {{ props.row.value }}
                  <q-popup-edit
                    v-model="props.row.value"
                    title="Update value"
                    v-if="props.row.data"
                    buttons
                  >
                    <q-input
                      v-model="props.row.value"
                      clearable
                      clear-icon="fas fa-times"
                      mask="########"
                      :rules="[binaryRule]"
                      maxlength="8"
                      dense
                      autofocus
                      counter
                    />
                  </q-popup-edit>
                  <q-tooltip
                    anchor="top middle"
                    self="bottom middle"
                    transition-show="scale"
                    transition-hide="scale"
                    v-if="props.row.data"
                    :offset="[10, 10]"
                  >
                    Click to edit (
                    <q-icon name="fas fa-angle-down" />)
                  </q-tooltip>
                </q-td>
                <q-td key="address" :id="props.row.address" :props="props">{{ props.row.address }}</q-td>
              </q-tr>
            </template>
          </q-table>

          <div class="row">
            <div class="col q-mr-md">
              <q-btn class="full-width glossy q-mt-md" @click="reset" label="Reset" />
            </div>
            <div class="col">
              <q-btn
                color="primary"
                @click="run"
                :disabled="run_disabled || memory[1].value === ''"
                class="full-width glossy q-mt-md"
                label="Run"
              />
            </div>
          </div>
        </div>
      </div>
    </q-form>
    <p class="status" v-if="status.show">{{ status.text }}</p>

    <q-dialog v-model="prompt" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">8 bits binary for Register 2</div>
        </q-card-section>

        <q-card-section>
          <q-input
            v-model="val_reg_2"
            clearable
            clear-icon="fas fa-times"
            mask="########"
            @keyup.enter="promptClosed"
            :rules="[binaryRule]"
            maxlength="8"
            dense
            autofocus
            counter
          />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn @click="promptClosed" flat label="Done" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { Promise } from "q";
export default {
  name: "home",
  data() {
    return {
      r1: "",
      r2: "",
      r3: "",
      ir: "",
      flag: "",
      pc: "",
      prompt: false,
      run_disabled: false,
      val_reg_2: "",
      status: { show: false, text: "Moving 8 bits data into Register 1..." },
      columns: [
        {
          name: "value",
          label: "Value (\u2082)",
          field: "value",
          align: "left"
        },
        {
          name: "address",
          label: "Address (\u2082)",
          field: "address",
          align: "left"
        }
      ],
      memory: [{}, { value: "" }],
      instructions: [
        {
          id: 1,
          name: "LOAD",
          size: "8", //bits
          to: "R1",
          byte: 2
        },
        {
          id: 2,
          name: "LOAD",
          size: "8", //bits
          to: "R2",
          byte: 2
        },
        {
          id: 3,
          name: "ADD",
          size: "8", //bits
          operand_1: "R1",
          operand_2: "R2",
          to: "R1",
          byte: 1
        },
        {
          id: 4,
          name: "AND",
          size: "8", //bits
          operand_1: "R1",
          operand_2: "R2",
          to: "R1",
          byte: 1
        },
        {
          id: 5,
          name: "JUMP",
          size: "8", //bits,
          byte: 3
        }
      ],
      pagination: {
        rowsPerPage: 10
      }
    };
  },
  methods: {
    findInstructions(id) {
      return this.instructions.find(function(ins) {
        return ins.id == parseInt(id, 2);
      });
    },
    findMemLocation(address) {
      return this.memory.find(function(mem) {
        return mem.address == address;
      });
    },
    to8BitsBinary(int) {
      return ("00000000" + int.toString(2)).slice(-8);
    },
    to16BitsBinary(int) {
      return ("0000000000000000" + int.toString(2)).slice(-16);
    },
    reset() {
      this.pc = "";
      this.ir = "";
      this.flag = "";
      this.r1 = "";
      this.r2 = "";
      this.r3 = "";
      this.memory = [
        {
          edited: false,
          value: this.to8BitsBinary(this.instructions[0].id),
          address: this.to16BitsBinary(this.instructions[0].id)
        },
        {
          edited: true,
          value: "",
          address: this.to16BitsBinary(this.instructions[0].id + 1)
        }
      ];
    },
    binaryRule(val) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          for (var i = 0; i < val.length; i++) {
            if (val.charAt(i) == 0 || val.charAt(i) == 1) {
              continue;
            } else {
              resolve("Please insert binary value.");
            }
          }
          resolve(true);
          // call
          //  resolve(true)
          //     --> content is valid
          //  resolve(false)
          //     --> content is NOT valid, no error message
          //  resolve(error_message)
          //     --> content is NOT valid, we have error message
          // calling reject(...) will also mark the input
          // as having an error, but there will not be any
          // error message displayed below the input
          // (only in browser console)
        }, 1000);
      });
    },
    async promptClosed() {
      this.prompt = false;
      await this.memory.push({
        data: false,
        value: this.val_reg_2,
        address: this.to16BitsBinary(4)
      });
      var mem_ins = this.findMemLocation(this.to16BitsBinary(3));
      this.status.text = "Moving 8 bits data into Register 2...";
      this.status.show = true;
      var process_finish = await this.doLoad(mem_ins, mem_ins, {
        value: this.val_reg_2
      });
      if (process_finish) {
        let add_finish = await this.doAddition(this.instructions[2]);
        if (add_finish) await this.doAnd(this.instructions[3]);
      }
    },
    async doAnd(instruction) {
      await this.memory.push({
        data: false,
        value: this.to8BitsBinary(instruction.id),
        address: this.to16BitsBinary(instruction.id + 2)
      });
      var memory_ins = await this.findMemLocation(
        this.to16BitsBinary(instruction.id + 2)
      );

      const ins_addr = document.getElementById(memory_ins.address);
      const ins_val = document.getElementById(memory_ins.value);
      const pc = document.querySelector(".pc");
      const ir = document.querySelector(".ir");
      const flag = document.querySelector(".flag");
      const r1 = document.querySelector(".r1");
      const r2 = document.querySelector(".r2");

      this.status.text = "AND process of R1 data & R2 data into Register 1...";
      this.status.show = true;

      await ins_addr.classList.add("blink");

      let op1 = instruction.operand_1 === "R1" ? this.r1 : this.r2;
      let op2 = instruction.operand_2 === "R2" ? this.r2 : this.r1;
      // let op1 = "11101011";
      // let op2 = "11101101";
      let result = "";

      for (let i = 0; i < op1.length; i++) {
        result += op1.charAt(i) & op2.charAt(i);
      }
      let carry = result.length !== 8 ? result.slice(0, 1) : 0;

      const vm = this;

      let promise = new Promise(function(resolve, reject) {
        setTimeout(function() {
          ins_addr.classList.remove("blink");
          pc.classList.add("blink-card");
          vm.pc = memory_ins.address;
        }, 2000);

        setTimeout(function() {
          pc.classList.remove("blink-card");
          ins_val.classList.add("blink");
        }, 4000);

        setTimeout(function() {
          ins_val.classList.remove("blink");
          ir.classList.add("blink-card");
          vm.ir = memory_ins.value;
        }, 6000);

        setTimeout(function() {
          ir.classList.remove("blink-card");
          r1.classList.add("blink-card");
          r2.classList.add("blink-card");
        }, 8000);

        setTimeout(function() {
          r1.classList.remove("blink-card");
          r2.classList.remove("blink-card");
          flag.classList.add("blink-card");
          vm.flag = vm.to8BitsBinary(carry);
        }, 10000);

        setTimeout(function() {
          flag.classList.remove("blink-card");
          r1.classList.add("blink-card");
          vm.r1 = result;
          vm.status.text = `JUMP to ${vm.to16BitsBinary(vm.instructions[2].id)}`
        }, 12000);

        setTimeout(function() {
          r1.classList.remove("blink-card");
          vm.status.show = false;
          // JUMP if carry
          if (carry == 0) {
            vm.doAddition(vm.instructions[2]);
          } else {
            resolve(true);
          }
          resolve(true);
        }, 14000);
      });

      return promise;

      // console.log(result);
    },
    async doAddition(instruction) {
      await this.memory.push({
        data: false,
        value: this.to8BitsBinary(instruction.id),
        address: this.to16BitsBinary(instruction.id + 2)
      });
      var memory_ins = await this.findMemLocation(
        this.to16BitsBinary(instruction.id + 2)
      );

      const ins_addr = document.getElementById(memory_ins.address);
      const ins_val = document.getElementById(memory_ins.value);
      const pc = document.querySelector(".pc");
      const ir = document.querySelector(".ir");
      const flag = document.querySelector(".flag");
      const r1 = document.querySelector(".r1");
      const r2 = document.querySelector(".r2");

      this.status.text =
        "Addition process of R1 data & R2 data into Register 1...";
      this.status.show = true;

      await ins_addr.classList.add("blink");
      let op_1 = instruction.operand_1 === "R1" ? this.r1 : this.r2;
      let op_2 = instruction.operand_2 === "R2" ? this.r2 : this.r1;
      // let op_1 = "11111111";
      // let op_2 = "11101011";
      let op = parseInt(op_1, 2) + parseInt(op_2, 2);

      let result = this.to8BitsBinary(op);
      let carry = op.toString(2).length !== 8 ? op.toString(2).slice(0, 1) : 0;

      const vm = this;

      let promise = new Promise(function(resolve, reject) {
        setTimeout(function() {
          ins_addr.classList.remove("blink");
          pc.classList.add("blink-card");
          vm.pc = memory_ins.address;
        }, 2000);

        setTimeout(function() {
          pc.classList.remove("blink-card");
          ins_val.classList.add("blink");
        }, 4000);

        setTimeout(function() {
          ins_val.classList.remove("blink");
          ir.classList.add("blink-card");
          vm.ir = memory_ins.value;
        }, 6000);

        setTimeout(function() {
          ir.classList.remove("blink-card");
          r1.classList.add("blink-card");
          r2.classList.add("blink-card");
        }, 8000);

        setTimeout(function() {
          r1.classList.remove("blink-card");
          r2.classList.remove("blink-card");
          flag.classList.add("blink-card");
          vm.flag = vm.to8BitsBinary(carry);
        }, 10000);

        setTimeout(function() {
          flag.classList.remove("blink-card");
          r1.classList.add("blink-card");
          vm.r1 = result;
        }, 12000);

        setTimeout(function() {
          r1.classList.remove("blink-card");
          vm.status.show = false;
          resolve(true);
        }, 14000);
      });

      return promise;

      // console.log(result);
      // console.log(carry);
    },
    async doLoad(instruction, memory_ins, memory_val) {
      const vm = this;
      // const next_pc = await this.to16BitsBinary(
      //   1 + parseInt(memory_ins.address, 2)
      // );
      // const next_mem_loc = await this.findMemLocation(next_pc);
      const ins_addr = document.getElementById(memory_ins.address);
      // const data_addr = document.getElementById(next_mem_loc.address);
      // const data_val = document.getElementById(next_mem_loc.value);
      const data_addr = document.getElementById(memory_val.address);
      const data_val = document.getElementById(memory_val.value);
      const ins_val = document.getElementById(memory_ins.value);
      const pc = document.querySelector(".pc");
      const ir = document.querySelector(".ir");
      // const flag = document.querySelector();
      const r1 = document.querySelector(".r1");
      const r2 = document.querySelector(".r2");

      await ins_addr.classList.add("blink");

      let promise = new Promise(function(resolve, reject) {
        setTimeout(function() {
          ins_addr.classList.remove("blink");
          pc.classList.add("blink-card");
          vm.pc = memory_ins.address;
        }, 2000);

        setTimeout(function() {
          pc.classList.remove("blink-card");
          ins_val.classList.add("blink");
        }, 4000);

        setTimeout(function() {
          ins_val.classList.remove("blink");
          ir.classList.add("blink-card");
          vm.ir = memory_ins.value;
        }, 6000);

        setTimeout(function() {
          ir.classList.remove("blink-card");
          data_addr.classList.add("blink");
        }, 8000);

        setTimeout(function() {
          data_addr.classList.remove("blink");
          pc.classList.add("blink-card");
          vm.pc = memory_val.address;
        }, 10000);

        setTimeout(function() {
          pc.classList.remove("blink-card");
          data_val.classList.add("blink-card");
        }, 12000);

        setTimeout(function() {
          data_val.classList.remove("blink-card");
          if (instruction.to === "R1") {
            r1.classList.add("blink-card");
            vm.r1 = memory_val.value;
          } else {
            r2.classList.add("blink-card");
            vm.r2 = memory_val.value;
          }
        }, 14000);

        setTimeout(function() {
          if (instruction.to === "R1") {
            r1.classList.remove("blink-card");
          } else {
            r2.classList.remove("blink-card");
          }
          vm.status.show = false;
          resolve(true);
        }, 16000);
      });

      return promise;
    },
    async run() {
      this.status.show = true;
      this.run_disabled = true;
      var memory_ins = this.findMemLocation(this.memory[0].address);
      var instruction = this.findInstructions(this.memory[0].value);
      if (instruction.byte === 2) {
        var memory_val = await this.findMemLocation(
          this.to16BitsBinary(1 + parseInt(memory_ins.address, 2))
        );
        if (instruction.name === "LOAD") {
          var process_finish = await this.doLoad(
            instruction,
            memory_ins,
            memory_val
          );
          if (process_finish) {
            // instruction 2
            await this.memory.push({
              data: false,
              value: this.to8BitsBinary(this.instructions[1].id),
              address: this.to16BitsBinary(this.instructions[1].id + 1)
            });
            this.prompt = true;
          }
        }
      }
      // console.log(instruction);
      // console.log(memory_ins);
    }
  },
  mounted() {
    // let binary = parseInt("00110011", 2) + parseInt("00110011", 2); // convert binary to int
    this.memory = [
      {
        data: false,
        value: this.to8BitsBinary(this.instructions[0].id),
        address: this.to16BitsBinary(this.instructions[0].id)
      },
      {
        data: true,
        value: "",
        address: this.to16BitsBinary(this.instructions[0].id + 1)
      }
    ];
    // console.log(("00000000" + binary.toString(2)).slice(-8)); // convert int to binary 8 bit
  }
};
</script>
