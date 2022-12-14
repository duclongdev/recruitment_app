import React, { useState } from 'react'
import style from './style.module.scss'
import { BtnControl, HeaderPostJob } from '../job'
import { InputContainer } from '../job'
import { useForm } from 'react-hook-form'
import { DropdownInput } from '../jobDetail'
import Input from '../../../../components/Input'
import clsx from 'clsx'
import { Checkbox } from '../jobDetail'
import { salary } from '../../../../utils/dataForOptions'
import { postStepContext } from '../../../../utils/MultiFormProvider'

const Salary = ({ handleClick }) => {
  const { postData, setPostData } = postStepContext()
  const [range, setRange] = useState(
    postData.salary?.salaryType == 'range' || postData.salary?.salaryType === undefined
      ? true
      : false
  )
  const [startSalary, setStartSalary] = useState('')
  const [endSalary, setEndSalary] = useState('')
  const [salaryAmount, setSalaryAmount] = useState('')
  const [checkBox, setCheckBox] = useState(
    postData.salary?.startAmount || postData.salary?.endAmount || postData.salary?.amount
      ? false
      : true
  )

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues: {
      salaryType: postData.salary?.salaryType,
      startAmount: postData.salary?.startAmount,
      endAmount: postData.salary?.endAmount,
      amount: postData.salary?.amount,
      time: postData.salary?.time ? postData.salary?.time : salary.times[0].value,
    },
  })

  const amount = {
    startAmount: 'startAmount',
    endAmount: 'endAmount',
    amount: 'amount',
  }

  const onSubmit = (data) => {
    let flag = true

    if (data.noneSalary === false || data.noneSalary === undefined) {
      if (data.salaryType === 'range') {
        if (data.startAmount === '') {
          setError(amount.startAmount, { message: 'Không được để trống phần này' })
          flag = false
        }
        if (data.endAmount === '') {
          setError(amount.endAmount, { message: 'Không được để trống phần này' })
          flag = false
        }
        if (
          data.startAmount !== '' &&
          data.endAmount !== '' &&
          parseInt(data.startAmount) >= parseInt(data.endAmount)
        ) {
          setError(amount.endAmount, { message: 'Không được ít hơn số tiền ban đầu' })
          flag = false
        }
        if (flag === true) {
          const salary = {
            salaryType: data.salaryType,
            startAmount: data.startAmount,
            endAmount: data.endAmount,
            time: data.time,
          }
          setPostData({ ...postData, salary })
          handleClick('next')
        }
      } else {
        if (data.amount === '') setError(amount.amount, { message: 'Không được để trống phần này' })
        else {
          const salary = {
            salaryType: data.salaryType,
            amount: data.amount,
            time: data.time,
          }
          setPostData({ ...postData, salary })
          handleClick('next')
        }
      }
    } else {
      setPostData({ ...postData, salary: 'noneSalary' })
      handleClick('next')
    }
  }

  const addCommas = (num) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  const removeNonNumeric = (num) => num.toString().replace(/[^0-9]/g, '')
  const handleStartAmount = (e) => {
    setStartSalary(addCommas(removeNonNumeric(e.target.value)))
    if (endSalary === '' && e.target.value === '') {
      setCheckBox(true)
    }
  }
  const trimComma = (num) => num.toString().replace(/.$/, '')

  const handleEndAmount = (e) => {
    setEndSalary(addCommas(removeNonNumeric(e.target.value)))
    console.log('start salary: ' + trimComma(endSalary))
    if (parseInt(trimComma(endSalary)) <= parseInt(trimComma(startSalary))) {
      setError(amount.endAmount, { message: 'Không được ít hơn số tiền ban đầu' })
    } else {
      clearErrors(amount.endAmount)
      setCheckBox(false)
    }
    if (e.target.value === '' && startSalary === '') {
      setCheckBox(true)
    }
  }

  const handleAmount = (e) => {
    setSalaryAmount(addCommas(removeNonNumeric(e.target.value)))
    setCheckBox(false)
    clearErrors(amount.amount)

    if (e.target.value === '') setCheckBox(true)
  }

  const handleNoneSalary = (e) => {
    if (e.target.checked === true)
      clearErrors([amount.startAmount, amount.endAmount, amount.amount])
  }

  return (
    <div className={style.salary}>
      <HeaderPostJob title="Thêm mức lương" path="assets/salary.svg" />
      <form className={style.salary__form} onSubmit={handleSubmit(onSubmit)}>
        <InputContainer>
          <fieldset>
            <legend>Mức lương cho công việc</legend>
            <DropdownInput
              label={'Hiển thị lương theo'}
              register={register}
              listData={salary.types}
              id={'salaryType'}
              onChange={(event) => {
                event.target.value === 'range' ? setRange(true) : setRange(false)
              }}
            />
            <div className={style.salary__amount}>
              <div
                className={clsx(style.rangeContainer, {
                  [style.hidden]: !range,
                })}
              >
                <Input
                  className={style.rangeItem}
                  label={'Từ'}
                  id="startAmount"
                  register={register}
                  children="VND"
                  value={startSalary}
                  error={errors.startAmount}
                  onChange={handleStartAmount}
                ></Input>
                <Input
                  className={style.rangeItem}
                  label={'Đến'}
                  id="endAmount"
                  register={register}
                  error={errors.endAmount}
                  children="VND"
                  value={endSalary}
                  onChange={handleEndAmount}
                ></Input>
              </div>

              <div
                className={clsx({
                  [style.hidden]: range,
                })}
              >
                <Input
                  error={errors.amount}
                  label={'Lương'}
                  id="amount"
                  register={register}
                  children="VND"
                  onChange={handleAmount}
                  value={salaryAmount}
                />
              </div>
              <DropdownInput label="Theo" register={register} listData={salary.times} id="time" />
            </div>
          </fieldset>
          {checkBox && (
            <Checkbox
              register={register}
              label="Tôi chọn không bao gồm thông tin thanh toán. Tôi hiểu rằng những công việc không có loại thông tin này sẽ nhận được ít hồ sơ chất lượng hơn."
              data="noneSalary"
              onChange={handleNoneSalary}
            />
          )}
        </InputContainer>

        <BtnControl handleClick={handleClick} />
      </form>
    </div>
  )
}

export default Salary
