import React from 'react';
import Select, {
  components,
  InputActionMeta,
  OptionProps,
  type ClearIndicatorProps,
  type DropdownIndicatorProps,
  type GroupBase,
  type MultiValueRemoveProps,
} from 'react-select';
import CreatableSelect from 'react-select/creatable';
import clsx from 'clsx';
import {X} from 'lucide-react';
import {CheckMarkIcon, DownArrowIcon} from '@/components/ui/icons';
import {PublicBaseSelectProps} from 'node_modules/react-select/dist/declarations/src/Select';

const DropdownIndicator = <
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>,
>(
  props: DropdownIndicatorProps<Option, IsMulti, Group>,
) => (
  <components.DropdownIndicator {...props}>
    <DownArrowIcon />
  </components.DropdownIndicator>
);

const ClearIndicator = <
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>,
>(
  props: ClearIndicatorProps<Option, IsMulti, Group>,
) => (
  <components.ClearIndicator {...props}>
    <X className="h-4 w-4 text-gray-500 hover:text-red-800" />
  </components.ClearIndicator>
);

const MultiValueRemove = (props: MultiValueRemoveProps) => (
  <components.MultiValueRemove {...props}>
    <X className="h-4 w-4 text-gray-500 hover:text-red-800" />
  </components.MultiValueRemove>
);

const Option = <
  OptionType,
  IsMulti extends boolean,
  Group extends GroupBase<OptionType>,
>(
  props: OptionProps<OptionType, IsMulti, Group>,
) => {
  return (
    <components.Option {...props}>
      <div className="flex justify-between items-center w-full">
        <span>{props.children}</span>
        {props.isSelected && <CheckMarkIcon />}
      </div>
    </components.Option>
  );
};

const controlStyles = {
  base: 'flex w-full rounded-xl border border-neutral-100 bg-white px-2.5 py-2 text-sm shadow-sm transition-colors placeholder:text-neutral-200 h-10',
  focus: 'outline-none ring-2 ring-purple-25 border-purple-400 ring-offset-0',
  nonFocus: 'border-neutral-100',
};

const placeholderStyles = 'text-neutral-200 text-sm ml-1';
const selectInputStyles = 'text-neutral-600 text-sm ml-1';
const valueContainerStyles = 'text-neutral-600 text-sm';
const singleValueStyles = 'ml-1';
const multiValueStyles =
  'ml-1 bg-neutral-25 border border-neutral-100 rounded items-center px-1 my-0.5 gap-1.5';
const multiValueLabelStyles = 'leading-5 text-xs py-0.5';
const multiValueRemoveStyles =
  'bg-white hover:bg-red-50 hover:text-red-800 text-gray-500 hover:border-red-300 rounded-md bg-neutral-25';
const indicatorsContainerStyles = 'gap-1 bg-white rounded-lg';
const clearIndicatorStyles = 'text-gray-500 rounded-md hover:text-red-800';
const indicatorSeparatorStyles = 'hidden bg-neutral-100';
const dropdownIndicatorStyles = 'hover:text-neutral-600 text-gray-500';
const menuStyles =
  'mt-0.5 py-1 px-1.5 border border-neutral-50 bg-white text-sm rounded-xl shadow-md';
const optionsStyle = ({
  isFocused,
  isSelected,
}: {
  isFocused: boolean;
  isSelected: boolean;
}) =>
  clsx(
    '!flex w-full h-8 my-0.5 select-none items-center gap-2 rounded-10px p-[8.6px] text-sm',
    {
      'bg-neutral-25 text-neutral-600': isFocused,
      '': isSelected,
      '!hover:bg-neutral-25 !hover:text-neutral-600': !isSelected,
    },
  );

const groupHeadingStyles = 'ml-3 mt-2 mb-1 text-gray-500 text-sm bg-white';
const noOptionsMessageStyles = 'text-neutral-200 bg-white';

interface CustomSelectProps<
  Option extends {label: string; value: string},
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>,
> extends Omit<
    PublicBaseSelectProps<Option, IsMulti, Group>,
    | 'onCreateOption'
    | 'inputValue'
    | 'onInputChange'
    | 'onMenuOpen'
    | 'onMenuClose'
  > {
  createAble: boolean;
  onCreateOption?: (inputValue: string) => void;
  inputValue?: string;
  onInputChange?: (newValue: string, actionMeta: InputActionMeta) => void;
  onMenuOpen?: () => void;
  onMenuClose?: () => void;
}

function SelectComponentInner<
  Option extends {label: string; value: string},
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>,
>(
  {
    options,
    value,
    onChange,
    onCreateOption,
    isMulti,
    isDisabled,
    components,
    createAble,
    isLoading,
    placeholder,
    ...props
  }: CustomSelectProps<Option, IsMulti, Group>,
  ref: React.ForwardedRef<
    React.ElementRef<typeof Select<Option, IsMulti, Group>>
  >,
) {
  const Comp = createAble ? CreatableSelect : Select;
  return (
    <Comp
      ref={ref}
      unstyled
      isClearable
      isSearchable
      value={value}
      isDisabled={isDisabled}
      isMulti={isMulti}
      isLoading={isLoading}
      placeholder={placeholder}
      components={{
        DropdownIndicator,
        ClearIndicator,
        MultiValueRemove,
        Option,
        ...components,
      }}
      defaultValue={value}
      options={options}
      noOptionsMessage={() => 'No options found'}
      onCreateOption={onCreateOption}
      onChange={onChange}
      classNames={{
        control: ({isFocused, isDisabled}) =>
          clsx(
            isDisabled ? 'cursor-not-allowed opacity-50' : '',
            isFocused ? controlStyles.focus : controlStyles.nonFocus,
            controlStyles.base,
          ),
        placeholder: () => placeholderStyles,
        input: () => selectInputStyles,
        option: optionsStyle,
        menu: () => menuStyles,
        valueContainer: () => valueContainerStyles,
        singleValue: () => singleValueStyles,
        multiValue: () => multiValueStyles,
        multiValueLabel: () => multiValueLabelStyles,
        multiValueRemove: () => multiValueRemoveStyles,
        indicatorsContainer: () => indicatorsContainerStyles,
        clearIndicator: () => clearIndicatorStyles,
        indicatorSeparator: () => indicatorSeparatorStyles,
        dropdownIndicator: () => dropdownIndicatorStyles,
        groupHeading: () => groupHeadingStyles,
        noOptionsMessage: () => noOptionsMessageStyles,
      }}
      {...props}
    />
  );
}

export const SelectComponent = React.forwardRef(SelectComponentInner) as <
  Option extends {label: string; value: string},
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>,
>(
  props: CustomSelectProps<Option, IsMulti, Group> & {
    createAble: boolean;
    ref?: React.ForwardedRef<
      React.ElementRef<typeof Select<Option, IsMulti, Group>>
    >;
  },
) => ReturnType<typeof SelectComponentInner>;
