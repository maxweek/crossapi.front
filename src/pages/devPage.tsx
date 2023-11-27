import { ChangeEvent, FC, useEffect, useState } from "react";
import Page, { PageBody, PageHead, PageInDev } from "../ui/page/page";
import API, { setRequest } from "../API";
import InputText from "../ui/input/input";
import Button from "../ui/button/button";
import Form, { FormActions, FormBody, FormHeader } from "../ui/form/form";
import Tile from "../components/tile/tile";
import Table, { Table_LoadMask } from "../ui/table/table";
import Paginator from "../components/paginator/paginator";
import Status, { IStatus } from "../components/status/status";

interface Props {
    title: string
}

const Dev_Page: FC<Props> = (props: Props) => {

    return (
        <Page>
            <PageHead title={props.title} />
            <PageBody>
                <PageInDev />
            </PageBody>
        </Page >
    )
}

export default Dev_Page