import { ChangeEvent, FC, useState } from "react";
import Page, { PageHead } from "../ui/page/page";
import API from "../API";
import InputText from "../ui/input/input";
import Button from "../ui/button/button";
import Form, { FormActions, FormBody, FormHeader } from "../ui/form/form";

interface Props {

}

const IndexPage: FC<Props> = (props: Props) => {
    return (
        <Page>
            <PageHead title={"Заголовок"} />
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Beatae, sed?</p>
        </Page>
    )
}

export default IndexPage