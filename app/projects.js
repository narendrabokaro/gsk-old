const projects = {
    template: 
                `<div>
                    <button type="button"
                        class="btn btn-primary m-2 fload-end"
                        data-bs-toggle="modal"
                        data-bs-target="#projectManagementModal"
                        @click="addProjectBtnAction()">
                        Add Projects
                    </button>

                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th>
                                    ID
                                </th>

                                <th>
                                    Name
                                </th>

                                <th>
                                    Description
                                </th>

                                <th>
                                    Start Date
                                </th>

                                <th>
                                    Employees
                                </th>

                                <th>
                                    Options
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr v-for="project in projects">
                                <td>{{project.id}}</td>
                                <td>{{project.name}}</td>
                                <td>{{project.description}}</td>
                                <td>{{project.startDate}}</td>
                                <td>{{project.employees.join(", ")}}</td>

                                <td>
                                    <button type="button"
                                    class="btn btn-light mr-1"
                                    data-bs-toggle="modal"
                                    data-bs-target="#projectManagementModal"
                                    @click="editProjectBtnAction(project)">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                                        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                                        <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                                        </svg>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    

                    <div class="modal fade" id="projectManagementModal" tabindex="-1"
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
                                        <span class="input-group-text">Name</span>
                                        <input type="text" class="form-control" v-model="name">
                                    </div>
                                    <div class="input-group mb-3">
                                        <span class="input-group-text">Description</span>
                                        <input type="text" class="form-control" v-model="description">
                                    </div>
                                    <div class="input-group mb-3">
                                        <span class="input-group-text">Start Date</span>
                                        <input type="date" class="form-control" v-model="startDate">
                                    </div>
                                    
                                    <div class="input-group mb-3">
                                        <span class="input-group-text">{{employeeTitle}}</span>
                                        <input type="text" class="form-control" v-model="employees" :disabled="isForUpdateForm">
                                    </div>

                                    <div class="input-group mb-3" v-if="isForUpdateForm">
                                        <input type="text" class="form-control" v-model="newEmployee">
                                    </div>

                                    <button type="button" @click="createProject()" v-if="id == 0" class="btn btn-primary">Create</button>
                                    <button type="button" @click="updateProject()" v-if="id != 0" class="btn btn-primary">Update</button>
                                    <button type="button" class="btn btn-primary" data-bs-dismiss="modal" ref="cancelBtn">Cancel</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`,
    data() {
        return{
            projects: [],
            employees: [],
            errors: [],
            errorMessage: "",
            modalTitle: "",
            employeeTitle: "Employees",
            newEmployee: "",
            isForUpdateForm: false,            
            id: 0,
            name: "",
            description: 0,
            startDate: ""
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
            axios.get(variables.API_URL + "projects")
            .then((response) => {
                // Push the response data to project object
                this.projects = response.data;
            });
        },
        /*
        * Action for Add project button
        */
        addProjectBtnAction () {
            // Change the modal title
            this.modalTitle = "Add Project";
            // Assign the employee field data
            this.employeeTitle = "Employees"
            // Indicate the update form
            this.isForUpdateForm = false;

            // Reset all required form data
            this.id = 0;
            this.name = "";
            this.description = "";
            this.startDate = "";
            this.newEmployee = "";
            this.employees = [];
        },
        /*
        * Action for Edit project button
        */
        editProjectBtnAction (project) {
            // Change the modal title
            this.modalTitle = "Update Project";
            // Assign the employee field data
            this.employeeTitle = "Add or Remove Employees";
             // Indicate the update form
            this.isForUpdateForm = true;
            // Assign the form data
            this.id = project.id;
            this.name = project.name;
            this.newEmployee = "";
            this.description = project.description;
            this.startDate = project.startDate;
            // To show the employee data 
            this.employees = project.employees.join(", ");
        },
        validateForm () {
            // Reset all errors
            this.errors = [];

            if (!this.name) {
                this.errors.push("Name required.");
            }

            if (!this.description) {
                this.errors.push('Description required.');
            }

            if (!this.startDate) {
                this.errors.push('Startdate required.');
            }

            if (this.isForUpdateForm) {
                if (this.newEmployee === "" && this.employees === "" || typeof this.employees === 'object') {
                    this.errors.push('Employees required.');
                } else if (this.newEmployee !== "" && this.newEmployee.match(/^[a-z0-9]+$/i) === null) {
                    this.errors.push('Employee : Only alphanumeric character allowed');
                } else if (this.newEmployee !== "" && this.newEmployee.length != 6) {
                    this.errors.push('Employee : Only 6 character allowed');
                }
            } else {
                if (this.employees === "" || typeof this.employees === 'object') {
                    this.errors.push('employees required.');
                }  else if (this.employees !== "" && this.employees.match(/^[a-z0-9]+$/i) === null) {
                    this.errors.push('Employee : Only alphanumeric character allowed');
                } else if (this.employees !== "" && this.employees.length != 6) {
                    this.errors.push('Employee : Only 6 character allowed');
                }
            }

            return this.errors.length;
        },
        createProject () {
            let that = this;
            // Basic form validation for update form
            if (!this.validateForm()) {
                // Create new project
                axios.post(variables.API_URL + "projects", {
                    name: this.name,
                    description: this.description,
                    startDate: this.startDate,
                    employees: this.employees.split(",")
                })
                .then((response) => {
                    // Refresh form data
                    this.refreshData();
                    // Reset the data
                    this.modalTitle = "Add Project";
                    this.id = 0;
                    this.name = "";
                    this.description = "";
                    this.startDate = "";
                    this.employees = [];
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
                // Create list of employee
                let employeeList = this.employees.length ? this.employees.split(", ") : [];
                // Search the employee from the emmployee list
                if (!employeeList.includes(this.newEmployee)) {
                    // If not found then add employee to employee list
                    employeeList.push(this.newEmployee);
                } else {
                    // If found then remove the employee to employee list
                    employeeList = employeeList.filter(emp => emp !== this.newEmployee);
                }

                // Make update employee API call
                axios.put(variables.API_URL + "projects/" + this.id, {
                    name: this.name,
                    description: this.description,
                    startDate: this.startDate,
                    employees: employeeList
                })
                .then((response) => {
                    // Refresh form data
                    this.refreshData();
                    // Reset data
                    this.newEmployee = "";
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