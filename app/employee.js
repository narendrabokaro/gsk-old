const employee = {
    template: 
                `<div>
                    <button type="button"
                        class="btn btn-primary m-2 fload-end"
                        data-bs-toggle="modal"
                        data-bs-target="#employeeManagementModal"
                        @click="addEmployeeBtnAction()">
                        Add Employee
                    </button>

                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th>
                                    EmployeeID
                                </th>

                                <th>
                                    Name
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr v-for="employee in employees">
                                <td>{{employee.employeeID}}</td>
                                <td>{{employee.name}}</td>
                            </tr>
                        </tbody>
                    </table>

                    

                    <div class="modal fade" id="employeeManagementModal" tabindex="-1"
                        aria-labelledby="projectManagementModalLabel" aria-hidden="true">
                    
                        <div class="modal-dialog modal-lg modal-dialog-centered">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="projectManagementModalLabel">{{modalTitle}}</h5>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal"
                                    aria-label="Close"></button>
                                </div>

                                <div class="modal-body">
                                    <p v-if="errors.length">
                                        <b>Please correct the following error(s):</b>
                                        <ul>
                                            <li v-for="error in errors">{{ error }}</li>
                                        </ul>
                                    </p>

                                    <div class="input-group mb-3">
                                        <span class="input-group-text">Employee ID</span>
                                        <input type="text" class="form-control" v-model="employeeID">
                                    </div>
                                    
                                    <div class="input-group mb-3">
                                        <span class="input-group-text">Name</span>
                                        <input type="text" class="form-control" v-model="name">
                                    </div>

                                    <button type="button" @click="createProject()" v-if="!isForUpdateForm" class="btn btn-primary">Create</button>
                                    <button type="button" class="btn btn-primary" data-bs-dismiss="modal" ref="cancelBtn">Cancel</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`,
    data() {
        return{
            employees: [],
            errors: [],
            errorMessage: "",
            modalTitle: "",
            newEmployee: "",

            isForUpdateForm: false,
            employeeID: 0,
            name: ""
        }
    },
    methods: {
        hideModal() {
            // Close the modal box
            const elem = this.$refs.cancelBtn;
            elem.click();
        },
        refreshData () {
            // Get fresh data everytime
            axios.get(variables.API_URL + "employees")
            .then((response) => {
                // Push the response data to project object
                this.employees = response.data;
            });
        },
        /*
        * Action for Add project button
        */
        addEmployeeBtnAction () {
            // Change the modal title
            this.modalTitle = "Add Employee";

            // Indicate the update form
            this.isForUpdateForm = false;

            // Reset all required form data
            this.employeeID = "";
            this.name = "";
        },
        /*
        * Action for Edit project button
        */
        editEmployeeBtnAction (employee) {
            // Change the modal title
            this.modalTitle = "Update Project";

             // Indicate the update form
            this.isForUpdateForm = true;
            // Assign the form data
            this.employeeID = employee.employeeID;
            this.name = employee.name;
        },
        validateForm () {
            // Reset all errors
            this.errors = [];

            if (!this.employeeID) {
                this.errors.push('employeeID required.');
            } else if (this.employeeID.match(/^[a-z0-9]+$/i) === null) {
                this.errors.push('Employee : Only alphanumeric character allowed');
            } else if (this.employeeID.length != 6) {
                this.errors.push('Employee : Only 6 character allowed');
            }

            if (!this.name) {
                this.errors.push("Name required.");
            }

            return this.errors.length;
        },
        createProject () {
            let that = this;
            // Basic form validation for update form
            if (!this.validateForm()) {
                // Create new project
                axios.post(variables.API_URL + "employees", {
                    employeeID: this.employeeID,
                    name: this.name
                })
                .then((response) => {
                    // Refresh form data
                    this.refreshData();
                    // Reset the data
                    this.modalTitle = "Add Employees";
                    this.employeeID = 0;
                    this.name = "";

                    // Close the modal
                    this.hideModal();
                })
                .catch(function (error) {
                    that.errors.push(error.response.data);
                });
            }
        },
        updateProject () {
            let that = this;

            // Basic form validation for update form
            if (!this.validateForm()) {
                // Make update employee API call
                axios.put(variables.API_URL + "employees/" + this.employeeID, {
                    employeeID: this.employeeID,
                    name: this.name
                })
                .then((response) => {
                    // Refresh form data
                    this.refreshData();
                    // Close the modal
                    this.hideModal();
                })
                .catch(function (error) {
                    that.errors.push(error.response.data);
                });
            }
        }
    },
    mounted: function () {
        this.refreshData();
    }
}