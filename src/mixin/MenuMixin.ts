import { Component, Vue } from 'vue-property-decorator'
import store from "@/store";
import {Modal} from "ant-design-vue";

@Component
class MenuMixinMixin extends Vue {
    public userName = '';
    public disabledMenu = false;
    public showAdministrationMenu = false;
    public administrationUsers = [
        "jcastillo@c-230.com",
        "mmartinez@c-230.com",
        "igomez@c-230.com",
        "cagurto@c-230.com",
        "hmedina@c-230.com",
        "sjacinto@c-230.com"
    ];

    checkIfUserCanSeeAdministratorMenu(){
        const user: any = store.state.user;
        if (user !== null){
            const email = user.email;
            const find =  this.administrationUsers.find( (value: string) => {
                return value == email;
            });
            if (find) return true;
        }
        return  false;
    }

    checkPermissionPolicy(){
        this.disabledMenu = this.$store.state.agreedToPrivacy;
        if (!this.disabledMenu)this.messagePolicy();
        return this.disabledMenu;
    }

    messagePolicy(){
        const confirm = Modal.info;
        confirm({
            title: 'Debe aceptar las políticas de uso para continuar.',
            content: '',
            okText: 'Continuar',
        });
    }

    goToMonthlyReport(){
        if (!this.checkPermissionPolicy()) return true;
        this['$router'].replace("/monthly-report-user");
    }

    goToGeneralRegisters(){
        if (!this.checkPermissionPolicy()) return true;
        this['$router'].replace("/administration");
    }

    goToReportsGeneration(){
        if (!this.checkPermissionPolicy()) return true;
        this['$router'].replace("/reports-generation");
    }

    goToHome(){
        if (!this.checkPermissionPolicy()) return true;
        this['$router'].replace("/home");
    }

    goToWelcome(){
        if (!this.checkPermissionPolicy()) return true;
        this['$router'].replace("/welcome");
    }

    goToQuery(){
        if (!this.checkPermissionPolicy()) return true;
        this['$router'].replace("/query-user");
    }

    goToVacation(){
        if (!this.checkPermissionPolicy()) return true;
        this['$router'].replace("/vacation");
    }
}
export default MenuMixinMixin
