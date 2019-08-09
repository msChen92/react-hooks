import React, { useEffect, useState, useCallback } from 'react';
import { PageHeaderWrapper } from "@ant-design/pro-layout";
import { Dispatch } from "redux";
import { Row, Col, Button, Divider, Popover } from 'antd';
import SearchForm from './components/SearchForm'
// import SchemaForm, { Field, Submit, FormButtonGroup } from "@uform/antd";
import { connect } from "dva";
import StandardTable from '@/components/StandardTable';
// import CreateCategory from './components/CreateCategory'
import { CategoryState } from './model';
// import { UserListItemParams } from './data';
import { ColumnProps } from 'antd/lib/table';

export interface ProductProps {
  categoryId: number
  id: number
  imageHost: string
  mainImage: string
  name: string
  price: number
  status: number
  subtitle: string
}

interface TableListProps {
  dispatch: Dispatch<any>;
  product: CategoryState
}

interface SearchFormProps {
  searchValue?: string | number
  searchType?: string
  pageNum?: number
}

const List = (props: TableListProps) => {
  const [selectedRows, SetRows] = useState([])
  const [searchValue, SetSearchValue] = useState<SearchFormProps>({})

  const { dispatch, product } = props;

  useEffect(() => {
    const { pagination } = props.product;
    dispatch({
      type: 'product/getList',
      payload: {
        ...searchValue,
        pageNum: searchValue.pageNum! || pagination.pageNum
      }
    })
  }, [searchValue])

  const submit = (values: any) => {
    const data = {
      ...values,
      pageNum: 1
    }
    SetSearchValue(data)
  }

  const columns: ColumnProps<any>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '备注',
      dataIndex: 'subtitle',
      key: 'subtitle'
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price'
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: number) => {
        interface statusObj {
          statusText: '在售' | '下架'
          btnText: '上架' | '下架'
          btnType: "primary" | "danger"
          btnIcon: "stop" | "to-top"
        }

        let statusObj: statusObj = {
          statusText: '在售',
          btnText: '下架',
          btnType: 'danger',
          btnIcon: 'stop'
        }
        if (status !== 1) {
          statusObj = {
            statusText: '下架',
            btnText: '上架',
            btnType: 'primary',
            btnIcon: 'to-top'
          }
        }
        return (
          <>
            <span>{statusObj.statusText}</span>
            <Divider type="vertical" />
            <Popover content={statusObj.btnText}>
              <Button shape="circle" icon={statusObj.btnIcon} type={statusObj.btnType}></Button>
            </Popover>
            
          </>
        )
      }
    },
    {
      title: '操作',
      dataIndex: '',
      key: 'x',
      width: 220,
      render: (item: any) => {
        return (
          <>
            <Button type="primary" icon="eye">查看</Button>
            <Divider type="vertical" />
            <Button type="ghost" icon="edit">编辑</Button>
          </>
        )
      }
    }
  ];

  const handleSelectRows = (rows: any) => {
    SetRows(rows)
  };

  const handleStandardTableChange = (pagination: any) => {
    dispatch({
      type: 'product/getList',
      payload: {
        ...searchValue,
        pageNum: pagination.current,
      }
    });
  };

  const handleAddModalVisible = useCallback((flag: boolean) => {
    // SetAddModalShow(flag)
  }, [])
  
  return (
    <PageHeaderWrapper>
      <Row style={{ marginBottom: 15 }} type="flex" justify="space-between" >
        <Col><SearchForm handleSubmit={submit} /></Col>
        <Col>
          <Button icon="plus" type="primary" onClick={() => handleAddModalVisible(true)}>新建</Button>
        </Col>
      </Row>

      <StandardTable
        data={product}
        rowKey="id"
        selectedRows={selectedRows}
        onSelectRow={handleSelectRows}
        columns={columns}
        // loading={loading}
        onChange={handleStandardTableChange}
      />
      {/* <ChangeCategoryNameModal
        submit={(v: any) => submitCategoryName(v)}
        visible={modalShow}
        cancelChange={() => cancelChange()}
        originName={selectedCategory.name}
      /> */}
      {/* {
        addModalShow && <CreateCategory 
                          toggleCreate={handleAddModalVisible} 
                          createCategoryShow={addModalShow} 
                          categoryList={data.list} 
                          categoryPath={categoryPath}
                        />
      } */}
    </PageHeaderWrapper>
  )
}

// interface ModalParams {
//   visible: boolean
//   originName?: string
//   submit: (v: any) => void
//   cancelChange: () => void
// }

// const ChangeCategoryNameModal = (props: ModalParams) => {
//   const { visible, submit, cancelChange, originName } = props
//   const defaultValue = {
//     categoryName: originName
//   }
//   if (visible) return (
//     <Modal
//       title="修改分类名称"
//       visible={visible}
//       footer={null}
//       onCancel={cancelChange}
//     >
//       <SchemaForm layout="vertical" onSubmit={submit} defaultValue={defaultValue}>
//         <Field
//           type="string"
//           required
//           name="categoryName"
//         />
//         <FormButtonGroup>
//           <Submit />
//           <Button onClick={cancelChange}>取消</Button>
//         </FormButtonGroup>
//       </SchemaForm>
//     </Modal>
//   );
//   return null
// }

export default connect(
  ({
    product
    // TODO:: dva的loading loading: loading.models.list,
  }: {
    product: ProductProps;
  }) => ({
    product
  })
)(List);