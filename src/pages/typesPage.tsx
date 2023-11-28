import { ChangeEvent, FC, useState } from "react";
import Page, { PageBody, PageHead } from "../ui/page/page";
import Table from "../ui/table/table";
import AppStore from "../store/store";

interface Props {

}

const TypesPage: FC<Props> = (props: Props) => {
    return (
        <Page>
            <PageHead title={"Типы"} />
            <PageBody>
                <Table thead={[
                    {
                        title: 'name',
                    },
                    {
                        title: 'description',
                    },
                    {
                        title: 'tsType',
                    },
                    {
                        title: 'dbType',
                    },
                    {
                        title: 'values',
                    },
                ]} tbody={AppStore.types.map(type => [
                    `${type.name}`,
                    `${type.description}`,
                    `${type.tsType}`,
                    `${type.dbType}`,
                    `${JSON.stringify(type.values)}`,
                ])} />
            </PageBody>
        </Page>
    )
}

export default TypesPage